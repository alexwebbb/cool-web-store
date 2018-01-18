const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	price_history: [
		{
			price: { type: Number, required: true },
			date: { type: Date, required: true, default: Date.now }
		}
	],
	availability: { type: Number, required: true, min: -1 },
	item_groups: {
		type: [
			{ type: Schema.Types.ObjectId, ref: "ItemGroup", required: true }
		],
		index: true
	}
});

module.exports = mongoose.model("Item", ItemSchema);
