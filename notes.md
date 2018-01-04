ok, thinking about structure of project...

front end will have access to the API.

User will log into page, and then press buttons

buttons are cart REST options

data model is 

Users = Name, Email, Password, Address, Cart, Orders
1 to Many - Cart X Users ~ Items
1 to Many - Orders X Users ~ Carts
Items = Name, Price, Group

Folder of views
each view is a function that returns html
should accept some sort of state object as parameter
database query is done in main script


callback side is jquery... on click... returns a genereic parameter.

when page loads, jquery is used to add appropriate classes to member columns
add class


