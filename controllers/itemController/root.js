"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group").default;
  
module.exports = async function (req, res, next) {
  const item_list = await Item.find({}, "name description price_history availability img_700_400")
    .populate("item_groups").exec(),
  item_groups = await Item_group.find();

    res.render("index", {
      title: "Item Store",
      item_groups: item_groups,
      item_list: item_list
    });
};
