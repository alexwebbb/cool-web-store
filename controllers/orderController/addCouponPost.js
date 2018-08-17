"use strict";

const User = require("../../models/user"),
  Coupon = require("../../models/coupon"),
  async = require("async");

module.exports = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        Coupon.findOne({ code: req.body.code }).exec(function(err, coupon) {
          if (err) return next(err);
          if (coupon === null) {
            const err = new Error("Coupon not found");
            err.status = 404;
            return next(err);
          }
          callback(null, coupon);
        });
      },
      function(coupon, callback) {
        User.findById(req.user._id).exec(function(err, user) {
          user.activateCoupon(coupon._id);
          user.save().then(function(res) {
            callback(null);
          });
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/store/cart/");
    }
  );
};
