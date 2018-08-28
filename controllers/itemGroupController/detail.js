"use strict";

const Item_group = require("../../models/item_group").default,
  Item = require("../../models/item");

module.exports = async function(req, res, next) {
  try {
    const item_group = await Item_group.findById(req.params.id).exec(),
    group_items = await Item.find({ item_groups: req.params.id }).exec();
        
        if (item_group == null) { 
          var err = new Error("item_group not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render
        res.render("group/detail", {
          title: "Item Group Detail",
          item_group: item_group,
          group_items: group_items
        });
  } catch (err) {
    return next(err);
  }
};
