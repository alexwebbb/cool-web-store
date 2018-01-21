const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValidPrice = RegExp(
	/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/
);

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	price_history: [
		{
			price: { type: Number, required: true },
			date: { type: Date, required: true, default: Date.now() }
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

ItemSchema.virtual("price")
	.get(function() {
		return this.price_history[0].price;
	})
	.set(function(value, date) {
		if (ValidPrice.test(value)) {
			this.price_history.unshift({
				price: parseInt(value),
				date: date ? new Date(date) : Date.now()
			});
			this.price_history.sort(function(a, b) {
				return a.date < b.date;
			});
		}
	});

module.exports = mongoose.model("Item", ItemSchema);
