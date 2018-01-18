const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	discount_percent: { type: Number, required: true, min: 0, max: 100 },
	valid_range: {
		begin: { type: Date, required: true, default: Date.now },
		end: { type: Date }
	},
	valid_item_groups: {
		type: [
			{ type: Schema.Types.ObjectId, ref: "ItemGroup", required: true }
		],
		index: true
	}
});

module.exports = mongoose.model("Coupon", CouponSchema);
