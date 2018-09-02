"use strict";

const User = require("../../models/user"),
  Coupon = require("../../models/coupon");

module.exports = async function(req, res, next) {
  try {
    const coupon = await Coupon.findOne({ code: req.body.coupon });
    if (coupon === null) {
      const err = new Error("Coupon not found");
      err.status = 422;
      return next(err);
    }

    const user = await User.findById(req.user._id);
    user.activateCoupon(coupon._id);
    await user.save();
    
    res.redirect("/store/cart/");
  } catch (err) {
    return next(err);
  }
};
