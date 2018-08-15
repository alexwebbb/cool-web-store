"use strict";

const ValidPrice = require("./ValidPrice"),
	ItemSchema = require("./schema");

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