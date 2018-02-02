"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	OrderSchema = new Schema({
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		cart: [
			{
				item_id: {
					type: Schema.Types.ObjectId,
					ref: "Item",
					required: true
				},
				quantity: { type: Number, required: true, min: 1 }
			}
		],
		coupons_present: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
		item_groups_present: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
		date_created: { type: Date, required: true, default: Date.now() },
		date_saved: Date,
		date_submitted: Date,
		shipping_address: {
			street_address: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			zip_code: { type: Number, required: true }
		},
		status: {
			type: String,
			required: true,
			enum: ["New", "Pending", "Complete", "Canceled", "Returned"],
			default: "New"
		}
	});

module.exports = mongoose.model("Order", OrderSchema);
