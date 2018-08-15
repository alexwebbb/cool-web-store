"use strict";

const ItemSchema = require("./schema");

ItemSchema.virtual("formattedPrice").get(function() {
	return this.price_history[0].price
		.toFixed(2)
		.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
});