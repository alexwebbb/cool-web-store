// ok, thinking about structure of project...

// front end will have access to the API.

// User will log into page, and then press buttons

// buttons are cart REST options

// data model is

// Users = Name, Email, Password, Address, Cart, Orders
// 1 to Many - Cart X Users ~ Items
// 1 to Many - Orders X Users ~ Carts
// Items = Name, Price, Group

// Lets start drawing some schemas

// Users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true, max: 24, lowercase: true },
	password: { type: String, required: true, min: 7, max: 48 },
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


const OrderSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
	cart: [
		{
			item_id: {
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true
			},
			quantity: { type: Number, required: true, min: 1 }
		}
	],
	coupon_id: { type: Schema.Types.ObjectId, ref: "Coupon" },
	date_created: { type: Date, required: true, default: Date.now },
	date_saved: Date,
	date_submitted: Date,
	shipping_address: {
		street_address: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip_code: { type: Number, required: true }
	},
	status: {
		type: String,
		required: true,
		enum: ["New", "Pending", "Complete", "Canceled", "Returned"],
		default: "New"
	}
});


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


const ItemGroupSchema = new Schema({
	name: { type: String, required: true },
	description: String
});


const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	price_history: [
		{
			price: { type: Number, required: true },
			date: { type: Date, required: true, default: Date.now }
		}
	],
	availability: { type: Number, required: true, min: -1 },
	item_groups: {
		type: [
			{ type: Schema.Types.ObjectId, ref: "ItemGroup", required: true }
		],
		index: true
	}
});


const CouponSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	discount_percent: { type: Number, required: true, min: 0, max: 100 },
	valid_range: {
		begin: { type: Date, required: true, default: Date.now },
		end: { type: Date }
	},
	valid_item_groups: {
		type: [
			{ type: Schema.Types.ObjectId, ref: "ItemGroup", required: true }
		],
		index: true
	}
});
