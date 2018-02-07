should have a cart controller

paths
  list\get
    > present view of item list as form
  list\post 
    > Resubmit a list of items with changes made.


Seems like this should just be the orders controller, where it is just like the items controller, but there is an additional post route for the list view.

The create get will load what is contained in the cart. the only modifiable fields on this form is the stripe form. The post route will be looking for the payment token

Ah, but I need a list view for all orders... but it needs to be defined by user

so something like 
	app/cart - list
	app/user:id/orders
	app/user:id/order:id

or something like 
	app/store/cart - current user cart list
	app/store/checkout
	app/orders/user:id
	app/orders/user:id/order:id