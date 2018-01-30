"use strict";

const mongoose = require("mongoose"),
	bcrypt = require("bcryptjs"),
	Schema = mongoose.Schema,
	UserSchema = new Schema({
		username: {
			type: String,
			required: true,
			min: 6,
			max: 24,
			lowercase: true
		},
		// password: { type: String, required: true, min: 7, max: 256 },
		hashedPassword: { type: String, required: true },
		email: { type: String, required: true, max: 320 },
		names: {
			first_name: { type: String, required: true, max: 24 },
			middle_name: { type: String, max: 24 },
			last_name: { type: String, required: true, max: 24 }
		},
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
		sessions: [
			{ type: Schema.Types.ObjectId, ref: "Session", required: true }
		],
		user_group: {
			type: String,
			required: true,
			enum: ["user", "admin"],
			default: "user"
		}
	});

UserSchema.virtual("url").get(function() {
	return "/user/" + this._id;
});

UserSchema.virtual("address")
	.get(function() {
		const { street_address, city, state, zip_code } = this.addresses[0];
		return `${street_address}, ${city} ${state} ${zip_code}`;
	})
	.set(function(v) {
		const { street_address, city, state, zip_code } = v;

		if (street_address && city && state && zipcode) {
			this.addresses.unshift({
				street_address: street_address,
				city: city,
				state: state,
				zip_code: zip_code
			});
		}
	});

UserSchema.virtual("name").get(function() {
	const { first_name, middle_name, last_name } = this.names;
	return `${first_name} ${middle_name} ${last_name}`;
});

// user authentication
UserSchema.methods.verifyPassword = function(password) {
	return bcrypt.compare(password, this.hashedPassword);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

module.exports = mongoose.model("User", UserSchema);
