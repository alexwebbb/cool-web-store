"use strict";

const Item_group = require("../../models/item_group").default;

module.exports = async function(req, res, next) {
  try {
    await Item_group.findByIdAndRemove(req.body.id);
    // Success - go to item list
    res.redirect("/store/groups");
  } catch (err) {
    return next(err);
  }
};
