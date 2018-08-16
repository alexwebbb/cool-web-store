"use strict";

const Item_group = require("../../models/item_group"),
  Item = require("../../models/item"),
  async = require("async");

module.exports = function(req, res, next) {
  async.parallel(
    {
      item_group: function(callback) {
        Item_group.findById(req.params.id).exec(callback);
      },

      group_items: function(callback) {
        Item.find({ item_groups: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.item_group == null) {
        // No results.
        var err = new Error("item_group not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("group/detail", {
        title: "Item Group Detail",
        item_group: results.item_group,
        group_items: results.group_items
      });
    }
  );
};
