"use strict";

const Item_group = require("../../models/item_group");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    Item_group.findById(req.params.id).exec(function(err, group) {
      if (err) return next(err);
      if (results.item === null) {
        const err = new Error("Group not found");
        err.status = 404;
        return next(err);
      }
      res.render("group/delete", {
        title: "Group Delete",
        group: group
      });
    });
  } else {
    res.redirect("/store/groups");
  }
};