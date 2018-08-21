"use strict";

const Coupon = require("../../models/coupon");

module.exports = async function(req, res, next) {
  try {
    await Coupon.findByIdAndRemove(req.body.id);
    // Success - go to coupon list
    res.redirect("/store/coupons");
  } catch (err) {
    return next(err);
  }
};
