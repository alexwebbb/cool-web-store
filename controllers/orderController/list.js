"use strict";

const Order = require("../../models/order");

module.exports = async function(req, res, next) {
  const order_list = await Order.find({}, "user total created_at")
    .populate("user")
    .exec();

  res.render("order/list", {
    title: "Order List",
    order_list: order_list
  });
};