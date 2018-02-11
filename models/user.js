"use strict";

const mongoose = require("mongoose"),
	salt = require("password-hash-and-salt"),
	moment = require("moment"),
	Schema = mongoose.Schema,
	Session = require("../models/session"),
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
				item: {
					type: Schema.Types.ObjectId,
					ref: "Item",
					required: true
				},
				quantity: { type: Number, required: true, min: 1, default: 1 }
			}
		],
		current_session: [
			{
				item: {
					type: Schema.Types.ObjectId,
					ref: "Item",
					required: true
				},
				time: { type: Date, required: true, default: Date.now() }
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

UserSchema.virtual("current_view")
	.get(function() {
		if (this.current_session) {
			return this.current_session[0];
		}
	})
	.set(function(v) {
		if (mongoose.Types.ObjectId.isValid(v)) {
			console.log("session length: " + this.current_session.length);
			if (this.current_session.length > 0) {
				if (
					moment(this.current_session[0].time)
						.add(15, "minutes")
						.isBefore(Date.now())
				) {
					console.log("timeout");
					// timeout, save session and start new one
					const session = new Session({
						user_id: this._id,
						views: this.current_session
					});

					session.save().then(function(res) {
						console.log("saved");
					});

					this.current_session = [{ item: v }];
				} else {
					console.log("add view");

					// set new current view
					this.current_session.unshift({ item: v });
				}
			} else {
				console.log("set initial");

				// set initial item
				this.current_session.unshift({ item: v });

				console.log("after the push" + this.current_session);
			}
		} else {
			return new Error(
				"Invalid item id. Something is wrong with the call of this function"
			);
		}
	});

UserSchema.methods.add_to_cart = function(id) {
	if (!this.current_cart.includes({ item: id })) {
		this.current_cart.push({ item: id });
		console.log("success");
	} else {
		this.current_cart.find(e => {
			e.item === id;
		}).quantity++;
	}
};

module.exports = mongoose.model("User", UserSchema);
