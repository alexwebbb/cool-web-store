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
	currentOrder: [
		{
			itemId: Schema.Types.ObjectId,
			quantity: Number
		}
	],
	orders: [Schema.Types.ObjectId]
});
