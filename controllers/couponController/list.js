"use strict";

const Coupon = require("../../models/coupon");

module.exports = async function (req, res, next) {
	try {
		const coupon_list = await Coupon.find({}, "name description discount_percent valid_range")
			.populate("valid_item_groups").exec();

		res.render("coupon/list", {
			title: "Coupon List",
			coupon_list: coupon_list
		});
	} catch (err) {
		return next(err);
	}
};