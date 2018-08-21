"use strict";

const Item = require("../../models/item"),
  Order = require("../../models/order");

module.exports = async function(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).exec(),
      orders = await Order.findOne({ "cart.item": req.params.id }).exec();
    if (item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    res.render("item/delete", {
      title: "Item Delete",
      orders: orders,
      item: item
    });
  } catch (err) {
    return next(err);
  }
};
