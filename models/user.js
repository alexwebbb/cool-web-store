const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true, max: 24, lowercase: true },
	password: { type: String, required: true, min: 7, max: 256 },
	email: { type: String, required: true, max: 24 },
	addresses: [
		{
			street_address: { type: String, required: true, max: 48 },
			city: { type: String, required: true, max: 24 },
			state: { type: String, required: true, max: 2 },
			zip_code: { type: Number, required: true, min: 5, max: 5 }
		}
	],
	current_cart: [
		{
			item_id: {
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true
			},
			quantity: { type: Number, required: true, min: 1 }
		}
	],
	current_session: [
		{
			item_id: {
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true
			},
			time: { type: Date, required: true, default: Date.now }
		}
	],
	orders: [{ type: Schema.Types.ObjectId, ref: "Order", required: true }],
	sessions: [{ type: Schema.Types.ObjectId, ref: "Session", required: true }]
	user_group: {
		type: String,
		required: true,
		enum: ["user", "admin", "owner"],
		default: "user"
	}
});

module.exports = mongoose.model("User", UserSchema);