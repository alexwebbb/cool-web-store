"use strict";

const ItemSchema = require("./schema");

ItemSchema.virtual("url").get(function() {
	return "/store/item/" + this._id;
});