"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group"),
  Shuffle = require("./../../utils/FisherYatesShuffle");

module.exports = async function(req, res, next) {
  const item_groups = await Item_group.find();
  let item_list = await Item.find(
    {},
    "name description price_history availability img_700_400"
  )
    .populate("item_groups")
    .exec();

  item_list = Shuffle(item_list);
  item_list = item_list.slice(0, 6);

  res.render("item/root", {
    title: "Item Store",
    item_groups: item_groups,
    item_list: item_list
  });
};
