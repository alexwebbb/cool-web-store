"use strict";

const User = require("../../models/user"),
  keys = require("../../config/keys"),
  GenerateCartData = require("./GenerateCartData"),
  Monetize = require("./../../utils/Monetize");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user._id, "current_cart")
      .populate("current_cart.item")
      .populate("active_coupons")
      .exec();

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const { adjustedCart, totalDiscount, total } = GenerateCartData(user.current_cart, user.active_coupons);

    res.render("order/cart_confirm", {
      title: "Checkout",
      cart_total: Monetize(total),
      totalDiscount: Monetize(totalDiscount),
      coupons: user.active_coupons,
      user_cart: adjustedCart,
      keyPublishable: keys.stripePublishable
    });
  } catch (err) {
    return next(err);
  }
};
