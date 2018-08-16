"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group"),
  async = require("async");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    // Get items and groups for form.
    async.parallel(
      {
        item: function(callback) {
          Item.findById(req.params.id)
            .populate("item_groups")
            .exec(callback);
        },
        groups: function(callback) {
          Item_group.find(callback);
        }
      },
      function(err, results) {
        if (err) {
          return next(err);
        }
        if (results.item == null) {
          // No results.
          const err = new Error("item not found");
          err.status = 404;
          return next(err);
        }
        // Success.
        // Mark our selected groups as checked.
        for (
          let all_g_iter = 0;
          all_g_iter < results.groups.length;
          all_g_iter++
        ) {
          for (
            let item_g_iter = 0;
            item_g_iter < results.item.item_groups.length;
            item_g_iter++
          ) {
            if (
              results.groups[all_g_iter]._id.toString() ==
              results.item.item_groups[item_g_iter]._id.toString()
            ) {
              results.groups[all_g_iter].checked = "true";
            }
          }
        }
        res.render("item/form", {
          title: "Update item",
          item_groups: results.groups,
          item: results.item
        });
      }
    );
  } else {
    res.redirect("/store/items");
  }
};
