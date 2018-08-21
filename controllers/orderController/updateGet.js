"use strict";

const User = require("../../models/user");

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
    
    const total = user.current_cart.reduce((a, c) => {
      return a + c.quantity * c.item.price;
    }, 0);

    res.render("order/cart_form", {
      title: "Cart",
      cart_total: total,
      user_cart: user.current_cart,
      user_coupons: user.active_coupons
    });
  } catch (err) {
    return next(err);
  }
};
