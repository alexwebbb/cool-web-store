"use strict";

const Item = require("../../models/item");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    if (err) {
      return next(err);
    }

    // Item is unused. It may be deleted
    Item.findByIdAndRemove(req.body.id, function(err) {
      if (err) {
        return next(err);
      }
      // Success - go to item list
      res.redirect("/store/items");
    });
  } else {
    res.redirect("/store/items");
  }
};