"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	SessionSchema = new Schema({
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
