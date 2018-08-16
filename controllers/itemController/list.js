"use strict";

const Item = require("../../models/item");

module.exports = function(req, res, next) {
  Item.find({}, "name description price_history availability img_100")
    .populate("item_groups")
    .exec(function(err, item_list) {
      if (err) return next(err);

      res.render("item/list", {
        title: "Item List",
        item_list: item_list
      });
    });
};
