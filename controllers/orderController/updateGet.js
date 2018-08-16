"use strict";

const User = require("../../models/user"),
  async = require("async");

module.exports = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        User.findById(req.user._id)
          .populate("current_cart.item")
          .populate("active_coupons")
          .exec(function(err, user) {
            callback(null, user);
          });
      },
      function(user, callback) {
        if (user.current_cart.find(x => x.item === null)) {
          user.current_cart = user.current_cart.filter(x => x.item !== null);
          User.findByIdAndUpdate(user._id, user, {}, function(err, _user) {
            if (err) {
              return next(err);
            }
            callback(null, _user);
          });
        } else {
          callback(null, user);
        }
      }
    ],
    function(err, user) {
      const total = user.current_cart.reduce((a, c) => {
        return a + c.quantity * c.item.price;
      }, 0);

      res.render("order/cart_form", {
        title: "Cart",
        cart_total: total,
        user_cart: user.current_cart,
        user_coupons: user.active_coupons
      });
    }
  );
};