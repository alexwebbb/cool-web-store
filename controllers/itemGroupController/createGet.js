"use strict";

module.exports = function(req, res, next) {
  res.render("group/form", { title: "Create Group" });
};
