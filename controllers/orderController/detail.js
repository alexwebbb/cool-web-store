"use strict";

const Order = require("../../models/order"),
  GenerateCartData = require("./GenerateCartData"),
  Monetize = require("./../../utils/Monetize");

module.exports = async function(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("current_cart.item")
      .populate("coupons_present")
      .exec();
    if (order === null) {
      const err = new Error("Order not found");
      err.status = 404;
      return next(err);
    }

    // need to fix this up to work with orders
    const { adjustedCart, totalDiscount, total } = GenerateCartData(order.cart, order.coupons_present);

    res.render("order/detail", {
      title: "Order Detail",
      cart_total: Monetize(total),
      totalDiscount: Monetize(totalDiscount),
      coupons: order.coupons_present,
      user_cart: adjustedCart
    });
  } catch (err) {
    return next(err);
  }
};
