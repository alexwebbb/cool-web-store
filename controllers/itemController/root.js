"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group"),
  async = require("async");

module.exports = function(req, res, next) {
  async.parallel(
    {
      item_list: function(callback) {
        Item.find({}, "name description price_history availability img_700_400")
          .populate("item_groups")
          .exec(callback);
      },
      item_groups: function(callback) {
        Item_group.find(callback);
      }
    },
    function(err, results) {
      if (err) return next(err);

      res.render("item/index", {
        title: "Item Store",
        item_groups: results.item_groups,
        item_list: results.item_list
      });
    }
  );
};
