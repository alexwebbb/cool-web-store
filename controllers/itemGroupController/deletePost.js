"use strict";

const Item_group = require("../../models/item_group");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    Item_group.findByIdAndRemove(req.body.id, function(err) {
      if (err) {
        return next(err);
      }
      // Success - go to item list
      res.redirect("/store/groups");
    });
  } else {
    res.redirect("/store/groups");
  }
};