"use strict";

const Coupon = require("../../models/coupon"),
  Order = require("../../models/order");

module.exports = async function(req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.id).exec(),
      orders = await Order.findOne({ coupons_present: req.body.id }).exec();

    if (coupon === null) {
      const err = new Error("Coupon not found");
      err.status = 404;
      return next(err);
    }
    res.render("coupon/delete", {
      title: "Coupon Delete",
      orders: orders,
      coupon: coupon
    });
  } catch (err) {
    return next(err);
  }
};
