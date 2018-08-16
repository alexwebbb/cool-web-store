"use strict";

const User = require("../../models/user");

module.exports = function(req, res, next) {
  if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
    User.findById(req.params.id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (user == null) {
        // No results.
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("user/form", {
        title: "Update user",
        user: user
      });
    });
  } else {
    res.redirect("/login");
  }
};