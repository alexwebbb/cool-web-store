"use strict";

const Coupon = require("../../models/coupon");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    Coupon.findByIdAndRemove(req.body.id, function(err) {
      if (err) {
        return next(err);
      }
      // Success - go to coupon list
      res.redirect("/store/coupons");
    });
  } else {
    res.redirect("/store/coupons");
  }
};
