"use strict";

const User = require("../../models/user");

module.exports = function(req, res, next) {
  if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
    User.findById(req.params.id).exec(function(err, user) {
      if (err) return next(err);
      if (user === null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      res.render("user/delete", {
        title: "User Delete",
        user: user
      });
    });
  } else {
    res.redirect("/login");
  }
};