"use strict";

const Coupon = require("../../models/coupon");

module.exports = async function (req, res, next) {
  if (req.user.user_group === "admin") {
    try {
      await Coupon.findByIdAndRemove(req.body.id);
      // Success - go to coupon list
      res.redirect("/store/coupons");
    } catch (err) {
      return next(err)
    }
  } else {
    res.redirect("/store/coupons");
  }
};
