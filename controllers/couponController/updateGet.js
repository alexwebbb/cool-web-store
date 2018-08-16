"use strict";

const Coupon = require("../../models/coupon"),
	Item_group = require("../../models/item_group"),
	async = require("async");

module.exports = function(req, res, next) {
	if (req.user.user_group === "admin") {
		// Get coupons and groups for form.
		async.parallel(
			{
				coupon: function(callback) {
					Coupon.findById(req.params.id)
						.populate("valid_item_groups")
						.exec(callback);
				},
				groups: function(callback) {
					Item_group.find(callback);
				}
			},
			function(err, results) {
				if (err) {
					return next(err);
				}
				if (results.coupon == null) {
					// No results.
					const err = new Error("coupon not found");
					err.status = 404;
					return next(err);
				}
				// Success.
				// Mark our selected groups as checked.
				for (
					let all_g_iter = 0;
					all_g_iter < results.groups.length;
					all_g_iter++
				) {
					for (
						let coupon_g_iter = 0;
						coupon_g_iter < results.coupon.valid_item_groups.length;
						coupon_g_iter++
					) {
						if (
							results.groups[all_g_iter]._id.toString() ==
							results.coupon.valid_item_groups[
								coupon_g_iter
							]._id.toString()
						) {
							results.groups[all_g_iter].checked = "true";
						}
					}
				}
				res.render("coupon/form", {
					title: "Update coupon",
					item_groups: results.groups,
					coupon: results.coupon
				});
			}
		);
	} else {
		res.redirect("/store/coupons");
	}
};