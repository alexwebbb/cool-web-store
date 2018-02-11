const Order = require("../models/order"),
    Item = require("../models/item"),
    User = require("../models/user");

/// SHOPPING CART MODIFICATION ROUTES ///

// adds item in question to the user cart
exports.item_add_post = function(req, res) {
    Item.findById(req.params.id).exec(function(err, item) {
        if (err) return next(err);
        if (item === null) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }
        if (req.user) {
            User.findById(req.user._id).exec(function(err, user) {
                user.add_to_cart(item._id);
                user.save().then(function(res) {
                    console.log("item added to cart");
                });
            });
        }

        res.redirect(item.url);
    });

    // this is called from each item page as a button
    // adds an item to the user object cart
};

// removes item in question to the user cart
exports.item_remove_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Item remove POST");
    // this is called from the item page as a button
    // removes an item in question from the user object cart
};

/// ORDER CREATION AND MODIFICATION ROUTES ///

// Display order create form on GET.
exports.order_create_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Order create GET");

    // this is the shopping cart
    // this checks the user object and then returns the list of items
    // in the cart. It then renders a form with those objects,
    // with a stripe form at the bottom
};

// Handle order create on POST.
exports.order_create_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Order create POST");

    // this accepts the incoming post request which will create our order
    // take the token, submit it to stripe, if it passes, save the order
    // otherwise reload the page
};

// Display item delete form on GET.
exports.order_delete_get = function(req, res, next) {
    res.send("NOT IMPLEMENTED: Order delete GET");

    // this is for emptying the cart
};

// Handle order delete on POST.
exports.order_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Order delete POST");

    // empty the user cart
};

// Display order update form on GET. maps to /cart
exports.order_update_get = function(req, res) {
    if (req.user) {
        User.findById(req.user._id)
            .populate("current_cart.item")
            .exec(function(err, user) {
                console.log(user.current_cart);
                res.render("cart_form", {
                    title: "Cart",
                    user_cart: user.current_cart
                });
            });
    } 

    // changing the contents of the cart. doesn't modify orders, just the cart
};

// Handle order update on POST.
exports.order_update_post = function(req, res) {
    res.send(req.body);

    // post for changing the cart
};

/// ORDER VIEWING ROUTES ///

// Display list of all orders.
exports.order_list = function(req, res) {
    res.send("NOT IMPLEMENTED: Order list");

    // This will require
    // Orders (populate the user field)
    // user_id from request (filter order list based on current user)
    // date created
};

// Display detail page for a specific order.
exports.order_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: Order detail GET");
    // this will require user id and order
    // Orders, filter by user
    // expand user
    // expand cart
    // expand coupons
    // expand item group/s
    // can only see if you are admin or the user in question
};
