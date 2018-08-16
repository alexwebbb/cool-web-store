"use strict";

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    res.render("group/form", { title: "Create Group" });
  } else {
    res.redirect("/store/groups");
  }
};