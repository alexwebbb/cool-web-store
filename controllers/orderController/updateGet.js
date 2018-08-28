"use strict";

const User = require("../../models/user"),
  GenerateCartData = require("./GenerateCartData"),
  Monetize = require("./../../utils/Monetize");

module.exports = async function(req, res, next) {
  try {
    let user = await User.findById(req.user._id)
      .populate("current_cart.item")
      .populate("active_coupons")
      .exec();

    if (user.current_cart.find(x => x.item === null)) {
      user.current_cart = user.current_cart.filter(x => x.item !== null);
      user = await User.findByIdAndUpdate(user._id, user, {});
    }

    const { adjustedCart, totalDiscount, total } = GenerateCartData(user.current_cart, user.active_coupons);

    res.render("order/cart_update", {
      title: "Cart",
      cart_total: Monetize(total),
      totalDiscount: Monetize(totalDiscount),
      coupons: user.active_coupons,
      user_cart: adjustedCart,
      user_coupons: user.active_coupons
    });
  } catch (err) {
    return next(err);
  }
};
