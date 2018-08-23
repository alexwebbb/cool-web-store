"use strict";

const User = require("../../models/user"),
monetize = (val) => {
  return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

module.exports = async function(req, res, next) {
  try {
    let user = await User.findById(req.user._id)
      .populate("current_cart.item")
      .populate("active_coupons")
      .exec();

    console.log(user.active_coupons[0].valid_item_groups);
    console.log(user.current_cart[0].item.item_groups);

    if (user.current_cart.find(x => x.item === null)) {
      user.current_cart = user.current_cart.filter(x => x.item !== null);
      user = await User.findByIdAndUpdate(user._id, user, {});
    }

    const adjustedCart = user.current_cart.map(({ item, quantity }) => {
      const basePrice = item.price,
        discount = item.price * (user.active_coupons[0].discount_percent / 100),
        adjustedprice = basePrice - discount;
      return { item, quantity, basePrice, discount, adjustedprice };
    });

    console.log(adjustedCart);

    const total = user.current_cart.reduce((a, c) => {
      return a + c.quantity * c.item.price;
    }, 0);

    res.render("order/cart_form", {
      title: "Cart",
      cart_total: total,
      coupons: user.active_coupons,
      user_cart: adjustedCart,
      user_coupons: user.active_coupons
    });
  } catch (err) {
    return next(err);
  }
};
