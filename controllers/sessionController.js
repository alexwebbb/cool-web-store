"use strict";

const Session = require("../models/session");

const constructChartData = data => {
  return {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "# of Views",
          data: Object.values(data),
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  };
};

// Display list of all sessions and prepares data for the graph.
exports.session_list = async function(req, res, next) {
  try {
    const session_list = await Session.find({}, "user views createdAt")
        .populate("user")
        .populate("views.item")
        .exec(),
      flat_list = session_list.reduce((a, v) => a.concat(v.views), []),
      counts = {};

    for (let i = 0; i < flat_list.length; i++) {
      counts[flat_list[i].item.name] =
        1 + (counts[flat_list[i].item.name] || 0);
    }

    let data = Object.keys(counts).map(v => {
      return { name: v, value: counts[v] };
    });
    data.sort((a, b) => {
      return b.value - a.value;
    });
    data = data.reduce(
      (a, { name, value }) => {
        a["names"].push(name);
        a["values"].push(value);
        return a;
      },
      { names: [], values: [] }
    );

    res.render("session/list", {
      title: "Session List",
      session_list,
      data
    });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific session.
exports.session_detail = async function(req, res, next) {
  try {
    const session_detail = await Session.find({}, "user views createdAt")
      .populate("user")
      .populate("views.item")
      .exec();

    res.render("session/detail", {
      title: "Session Detail",
      session_detail: session_detail
    });
  } catch (err) {
    return next(err);
  }
};

exports.clear_session_list = async function(req, res, next) {
  try {
    await Session.remove({}).exec();
    res.redirect("");
  } catch (err) {
    next(err);
  }
};

exports.CheckCreds = (req, res, next) => {
  if (!req.user.user_group === "admin") {
    res.redirect("/login");
  }
  next();
};
