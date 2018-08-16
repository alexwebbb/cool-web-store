"use strict";

const Coupon = require("../../models/coupon");

// Display detail page for a specific coupon.
module.exports = function(req, res, next) {
	Coupon.findById(req.params.id)
		.populate("valid_item_groups")
		.exec(function(err, coupon_detail) {
			if (err) return next(err);
			if (coupon_detail === null) {
				const err = new Error("Coupon not found");
				err.status = 404;
				return next(err);
			}
			res.render("coupon/detail", {
				title: "Coupon Detail",
				coupon_detail: coupon_detail
			});
		});
};