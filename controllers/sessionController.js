"use strict";

const Session = require("../models/session");

// Display list of all sessions.
exports.session_list = async function(req, res, next) {
  try {
    const session_list = await Session.find({}, "user views createdAt")
        .populate("user")
        .populate("views.item")
        .exec(),
      flat_list = session_list.reduce((a, v) => a.concat(v.views), []),
      counts = {};
    for (let i = 0; i < flat_list.length; i++) {
      counts[flat_list[i].item.name] = 1 + (counts[flat_list[i].item.name] || 0);
    }
    console.log(counts);
    res.render("session/list", {
      title: "Session List",
      session_list: session_list
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
