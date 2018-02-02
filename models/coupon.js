"use strict";

const mongoose = require("mongoose"),
	moment = require("moment"),
	Schema = mongoose.Schema,
	CouponSchema = new Schema({
		name: { type: String, required: true },
		description: String,
		discount_percent: { type: Number, required: true, min: 0, max: 100 },
		valid_range: {
			begin: { type: Date, required: true, default: Date.now() },
			end: { type: Date, default: null }
		},
		valid_item_groups: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "ItemGroup"
				}
			],
			required: true
		}
	});

CouponSchema.virtual("url").get(function() {
	return "/store/coupon/" + this._id;
});

CouponSchema.virtual("begin_date_formatted").get(function() {
	return moment(this.valid_range.begin).format("MMMM Do, YYYY");
});

CouponSchema.virtual("end_date_formatted").get(function() {
	if (this.valid_range.end) {
		return moment(this.valid_range.end).format("MMMM Do, YYYY");
	} else {
		return null;
	}
});

CouponSchema.virtual("expiration_date").get(function() {
	if (this.valid_range.end) {
		return moment(this.valid_range.end).format("MMMM Do, YYYY");
	} else {
		return null;
	}
}).set(function(value) {
	this.valid_range.end = value;
});

module.exports = mongoose.model("Coupon", CouponSchema);