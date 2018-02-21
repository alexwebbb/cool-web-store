"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	OrderSchema = new Schema({
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		cart: [
			{
				item: {
					type: Schema.Types.ObjectId,
					ref: "Item",
					required: true
				},
				quantity: { type: Number, required: true, min: 1 }
			}
		],
		coupons_present: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
		item_groups_present: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
		shipping_address: {
			street_address: { type: String },
			city: { type: String },
			state: { type: String },
			zip_code: { type: Number }
		},
		status: {
			type: String,
			required: true,
			enum: ["New", "Pending", "Complete", "Canceled", "Returned"],
			default: "New"
		}
	});

module.exports = mongoose.model("Order", OrderSchema);
