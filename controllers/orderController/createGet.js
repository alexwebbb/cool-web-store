"use strict";

const User = require("../../models/user"),
  keys = require("../../config/keys");

module.exports = function(req, res, next) {
  User.findById(req.user._id, "current_cart")
    .populate("current_cart.item")
    .exec(function(err, user) {
      if (err) return next(err);
      if (user === null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      const total = user.current_cart.reduce((a, c) => {
        return a + c.quantity * c.item.price;
      }, 0);

      res.render("order/checkout_form", {
        title: "Checkout",
        cart_total: total,
        user_cart: user.current_cart,
        keyPublishable: keys.stripePublishable
      });
    });
};
