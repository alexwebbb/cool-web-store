"use strict";

const Coupon = require("../../models/coupon"),
  Order = require("../../models/order"),
  async = require("async");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    async.parallel(
      {
        coupon: function(callback) {
          Coupon.findById(req.params.id).exec(callback);
        },
        orders: function(callback) {
          Order.findOne({ coupons_present: req.body.id }).exec(callback);
        }
      },
      function(err, results) {
        if (err) return next(err);
        if (results.coupon === null) {
          const err = new Error("Coupon not found");
          err.status = 404;
          return next(err);
        }
        res.render("coupon/delete", {
          title: "Coupon Delete",
          orders: results.orders,
          coupon: results.coupon
        });
      }
    );
  } else {
    res.redirect("/store/coupons");
  }
};
