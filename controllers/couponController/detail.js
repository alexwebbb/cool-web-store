"use strict";

const Coupon = require("../../models/coupon");

module.exports = async function (req, res, next) {
	try {
		const coupon_detail = await Coupon.findById(req.params.id)
			.populate("valid_item_groups").exec();
		if (coupon_detail === null) {
			const err = new Error("Coupon not found");
			err.status = 404;
			return next(err);
		}
		res.render("coupon/detail", {
			title: "Coupon Detail",
			coupon_detail: coupon_detail
		});
	} catch (err) {
		return next(err);
	}
};