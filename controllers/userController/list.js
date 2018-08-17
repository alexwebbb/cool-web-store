"use strict";

const User = require("../../models/user");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    User.find().exec(function(err, user_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("user/list", {
        title: "User List",
        user_list: user_list
      });
    });
  } else {
    res.redirect("/login");
  }
};
