const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemGroupSchema = new Schema({
	name: { type: String, required: true },
	description: String
});

module.exports = mongoose.model("ItemGroup", ItemGroupSchema);
