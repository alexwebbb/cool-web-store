"use strict";

const User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    let user = req.user,
      cart = req.user.current_cart;

    cart.forEach((e, i) => {
      const q = parseInt(req.body.quantity[i]);
      if (q > 0) {
        e.quantity = q;
      }
    });

    if (req.body.cart) {
      cart = cart.filter(x => !req.body.cart.includes(x.item));
    }

    user.current_cart = cart;

    await User.findByIdAndUpdate(user._id, user, {});
    res.redirect("/store/cart");
  } catch (err) {
    return next(err);
  }
};
