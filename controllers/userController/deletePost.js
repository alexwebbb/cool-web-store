"use strict";

const User = require("../../models/user");

module.exports = function(req, res, next) {
  if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
    User.findByIdAndRemove(req.body.id, function(err) {
      if (err) {
        return next(err);
      }

      if (req.user.user_group === "admin") {
        // Success - go to user list
        res.redirect("/users");
      } else {
        // User Has deleted themself, log them out
        req.logout();
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/login");
  }
};