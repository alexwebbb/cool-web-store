"use strict";

const User = require("../../models/user"),
  keys = require("../../config/keys");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user._id, "current_cart")
      .populate("current_cart.item")
      .exec();
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
  } catch (err) {
    return next(err);
  }
};
