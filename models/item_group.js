"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	ItemGroupSchema = new Schema({
		name: { type: String, required: true },
		description: String,
		img_100: String,
		img_700_400: String
	});

ItemGroupSchema.virtual("url").get(function() {
	return "/store/group/" + this._id;
});

module.exports = mongoose.model("ItemGroup", ItemGroupSchema);
