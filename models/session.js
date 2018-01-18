const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
	views: [
		{
			item_id: {
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true
			},
			time: { type: Date, required: true }
		}
	],
	date_created: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("Session", SessionSchema);
