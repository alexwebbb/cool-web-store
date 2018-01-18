const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
	coupon_id: { type: Schema.Types.ObjectId, ref: "Coupon" },
	date_created: { type: Date, required: true, default: Date.now },
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
