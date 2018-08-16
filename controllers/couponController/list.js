"use strict";

const Coupon = require("../../models/coupon");

module.exports = function(req, res, next) {
	Coupon.find({}, "name description discount_percent valid_range")
		.populate("valid_item_groups")
		.exec(function(err, coupon_list) {
			if (err) return next(err);

			res.render("coupon/list", {
				title: "Coupon List",
				coupon_list: coupon_list
			});
		});
};