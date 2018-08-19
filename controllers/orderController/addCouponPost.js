"use strict";

const User = require("../../models/user"),
  Coupon = require("../../models/coupon");

module.exports = async function(req, res, next) {
  try {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (coupon === null) {
      const err = new Error("Coupon not found");
      err.status = 404;
      return next(err);
    }
  } catch (err) {
    return next(err);
  }

  const user = await User.findById(req.user._id);
  user.activateCoupon(coupon._id);
  user.save();
  res.redirect("/store/cart/");
};
