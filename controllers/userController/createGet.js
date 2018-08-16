"use strict";

// Display User create form on GET.
module.exports = function(req, res, next) {
  res.render("user/form", {
    title: "Create User",
    user: { group: "admin" }
  });
};