"use strict";

const Session = require("../models/session");

// Display list of all sessions.
exports.session_list = async function(req, res, next) {
  try {
    const session_list = await Session.find({}, "user views date_created")
      .populate("user")
      .populate("views.item")
      .exec();

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
    const session_detail = await Session.find({}, "user views")
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
