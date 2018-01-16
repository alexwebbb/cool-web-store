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

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	address: {
		streetAddress: String,
		city: String,
		state: String,
		zipCode: Number
	},
	currentCart: [
		{
			itemId: Schema.Types.ObjectId,
			quantity: Number
		}
	],
	orders: [Schema.Types.ObjectId]
});

const orderSchema = new Schema({
	user_id: Schema.Types.ObjectId, // maybe
	cart: [
		{
			itemId: Schema.Types.ObjectId,
			quantity: Number
		}
	],
	dateCreated: Date,
	dateSaved: Date,
	dateSubmitted: Date,
	completed: Boolean
});

const itemSchema = new Schema({
	name: type: String,
	description: String,
	priceSchedule: [
		{
			price: Number,
			date: Date
		}
	],
	availability: Number,
	group: { type: [String], index: true }
});
