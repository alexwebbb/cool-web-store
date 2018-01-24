const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValidPrice = RegExp(
	/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/
);

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	price_history: {
		type: [
			{
				price: {
					type: Number,
					validate: {
						validator: function(v) {
							return ValidPrice.test(v);
						},
						message: "{VALUE} is not a valid price!"
					},
					required: true
				},
				date: { type: Date, required: true, default: Date.now() }
			}
		],
		required: true
	},
	availability: { type: Number, required: true, min: -1, default: 0 },
	item_groups: [
		{ type: Schema.Types.ObjectId, ref: "ItemGroup", required: true }
	]
});

ItemSchema.virtual("price")
	.get(function() {
		return this.price_history[0].price;
	})
	.set(function(value, date) {
		if (ValidPrice.test(value)) {
			this.price_history.unshift({
				price: parseInt(value),
				// ternary operator
				date: date ? new Date(date) : Date.now()
			});
			this.price_history.sort(function(a, b) {
				return a.date < b.date;
			});
		} else {
			return new Error("Bad Format on the Price");
		}
	});

ItemSchema.virtual("url").get(function() {
	return "/store/item/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
