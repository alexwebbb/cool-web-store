"use strict";

const Order = require("../../models/order");

module.exports = function(req, res, next) {
  if (req.user.id === req.params.id || req.user.user_group === "admin") {
    Order.findById(req.params.id)
      .populate("user")
      .exec(function(err, order) {
        if (err) return next(err);
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
      });
  }
};