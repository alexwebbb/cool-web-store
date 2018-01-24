const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemGroupSchema = new Schema({
	name: { type: String, required: true },
	description: String
});

ItemGroupSchema.virtual("url").get(function() {
	return "/store/group/" + this._id;
});

module.exports = mongoose.model("ItemGroup", ItemGroupSchema);
