"use strict";

const Item = require("../../models/item");

module.exports = async function (req, res, next) {
  try {
    const item_list = await Item.find({}, "name description price_history availability img_100")
      .populate("item_groups").exec();
    res.render("item/list", {
      title: "Item List",
      item_list: item_list
    });
  } catch (err) {
    return next(err);
  }
};
