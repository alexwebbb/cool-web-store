"use strict";

const User = require("../../models/user");

module.exports = function(req, res, next) {
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

  User.findByIdAndUpdate(user._id, user, {}, function(err, _user) {
    if (err) {
      return next(err);
    }
    // Successful - redirect to book detail page.
    res.redirect("/store/cart");
  });
};