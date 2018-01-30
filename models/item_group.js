"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	ItemGroupSchema = new Schema({
		name: { type: String, required: true },
		description: String
	});

ItemGroupSchema.virtual("url").get(function() {
	return "/store/group/" + this._id;
});

module.exports = mongoose.model("ItemGroup", ItemGroupSchema);
