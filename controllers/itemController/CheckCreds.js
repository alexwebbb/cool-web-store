"use strict";

module.exports = (req, res, next) => {
  if (!req.user.user_group === "admin") {
    res.redirect("/store/items");
  }
  next();
};
