"use strict";

const Item_group = require("../../models/item_group");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    Item_group.findById(req.params.id).exec(function(err, group) {
      if (err) {
        return next(err);
      }
      if (group == null) {
        // No results.
        const err = new Error("item not found");
        err.status = 404;
        return next(err);
      }
      // Success.

      res.render("group/form", {
        title: "Update group",
        group: group
      });
    });
  } else {
    res.redirect("/store/groups");
  }
};