"use strict";

const Order = require("../../models/order");

module.exports = async function(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .exec();
    if (order === null) {
      const err = new Error("Order not found");
      err.status = 404;
      return next(err);
    }

    res.render("order/detail", {
      title: "Order Detail",
      user_cart: order.cart,
      cart_total: order.total,
      user: order.user
    });
  } catch (err) {
    return next(err);
  }
};
