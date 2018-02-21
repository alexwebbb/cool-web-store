"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	ValidPrice = RegExp(
		/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/
	),
	ItemSchema = new Schema({
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
		active: { type: Boolean, required: true, default: true },
		item_groups: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
		img_100: String,
		img_700_400: String
	});

ItemSchema.virtual("price")
	.get(function() {
		return this.price_history[0].price;
	})
	.set(function(value, date) {
		if (ValidPrice.test(value)) {
			this.price_history.unshift({
				price: parseInt(value)
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

ItemSchema.virtual("formatted_groups").get(function() {
	if (this.item_groups.length > 1) {
		const last = this.item_groups.pop();
		return (
			this.item_groups.map(e => e.name).join(", ") + " and " + last.name
		);
	} else if (this.item_groups.length === 1) {
		return this.item_groups[0].name;
	} else {
		return "";
	}
});

ItemSchema.virtual("formatted_price").get(function() {
	return this.price_history[0].price
		.toFixed(2)
		.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
});

module.exports = mongoose.model("Item", ItemSchema);
