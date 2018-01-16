ok, thinking about structure of project...

front end will have access to the API.

User will log into page, and then press buttons

buttons are cart REST options

data model is 

Users = Name, Email, Password, Address, Cart, Orders
1 to Many - Cart X Users ~ Items
1 to Many - Orders X Users ~ Carts
Items = Name, Price, Group

Lets start drawing some schemas

Users
{
	"username": String
}

