"use strict";

const Item = require("../../models/item");

module.exports = async function (req, res, next) {
  if (req.user.user_group === "admin") {
    try {
      // Item is unused. It may be deleted
      await Item.findByIdAndRemove(req.body.id);
      // Success - go to item list
      res.redirect("/store/items");
    } catch (err) {
      return next(err);
    }
  } else {
    res.redirect("/store/items");
  }
};