"use strict";

const CouponSchema = require("./schema");

CouponSchema.virtual("url").get(function() {
	return "/store/coupon/" + this._id;
});