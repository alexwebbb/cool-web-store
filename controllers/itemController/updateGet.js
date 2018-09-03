"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group");

module.exports = async function(req, res, next) {
  try {
    // Get items and groups for form.
    const item = await Item.findById(req.params.id)
        .populate("item_groups")
        .exec(),
      groups = await Item_group.find();

    if (item == null) {
      const err = new Error("item not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    // Mark our selected groups as checked.
    for (let all_g_iter = 0; all_g_iter < groups.length; all_g_iter++) {
      for (
        let item_g_iter = 0;
        item_g_iter < item.item_groups.length;
        item_g_iter++
      ) {
        if (
          groups[all_g_iter]._id.toString() ==
          item.item_groups[item_g_iter]._id.toString()
        ) {
          groups[all_g_iter].checked = "true";
        }
      }
    }
    res.render("item/form", {
      title: "Update item",
      item_groups: groups,
      item: item
    });
  } catch (err) {
    return next(err);
  }
};
