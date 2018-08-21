"use strict";

const User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    await User.findByIdAndRemove(req.body.id);

    if (req.user.user_group === "admin") {
      res.redirect("/users");
    } else {
      // User Has deleted themself, log them out
      req.logout();
      res.redirect("/");
    }
  } catch (err) {
    return next(err);
  }
};
