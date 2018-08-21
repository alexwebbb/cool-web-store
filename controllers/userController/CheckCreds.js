"use strict";

module.exports = (req, res, next) => {
  if (!req.user._id.equals(req.params.id) && !req.user.user_group === "admin") {
    res.redirect("/login");
  }
  next();
};
