const Order = require("../models/order"),
    Item = require("../models/item"),
    User = require("../models/user"),
    keys = require("../config/keys"),
    async = require("async"),
    // Initialize stripe
    stripe = require("stripe")(keys.stripeSecret);

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
        // User object is en
        User.findById(req.user._id).exec(function(err, user) {
            user.add_to_cart(item._id);
            user.save().then(function(res) {
                console.log("item added to cart");
            });
        });

        res.redirect(item.url);
    });

    // this is called from each item page as a button
    // adds an item to the user object cart
};

/// ORDER CREATION AND MODIFICATION ROUTES ///

// Display order create form on GET.
exports.order_create_get = function(req, res) {
    async.parallel(
        {
            user: function(callback) {
                User.findById(req.user._id, "current_cart")
                    .populate("current_cart.item")
                    .exec(callback);
            }
        },
        function(err, results) {
            if (err) return next(err);
            if (results.user === null) {
                const err = new Error("User not found");
                err.status = 404;
                return next(err);
            }

            const total = results.user.current_cart.reduce((a, c) => {
                return a + c.quantity * c.item.price;
            }, 0);

            res.render("order/checkout_form", {
                title: "Checkout",
                cart_total: total,
                user_cart: results.user.current_cart,
                keyPublishable: keys.stripePublishable
            });
        }
    );

    // this is the shopping cart
    // this checks the user object and then returns the list of items
    // in the cart. It then renders a form with those objects,
    // with a stripe form at the bottom
};

// Handle order create on POST.
exports.order_create_post = function(req, res) {
    let amount = 500;

    console.log(stripe.customers);

    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            })
        )
        .then(charge => res.render("charge_result.pug"));

    // order = new Order({
    //     name: req.body.item_name,
    //     description: req.body.description,
    //     price: req.body.price,
    //     item_groups: req.body.item_groups
    // });

    // order.save(function(err) {
    //     if (err) {
    //         return next(err);
    //     }
    //     // Successful - redirect to new item record.
    //     res.redirect(order.url);
    // });
    // this accepts the incoming post request which will create our order
    // take the token, submit it to stripe, if it passes, save the order
    // otherwise reload the page
};

// Display order update form on GET. maps to /cart
exports.order_update_get = function(req, res) {
    if (req.user) {
        User.findById(req.user._id)
            .populate("current_cart.item")
            .exec(function(err, user) {
                if (user.current_cart.find(x => x.item === null)) {
                    user.current_cart = user.current_cart.filter(x => x.item !== null);
                    User.findByIdAndUpdate(user._id, user, {}, function(
                        err,
                        _user
                    ) {
                        if (err) {
                            return next(err);
                        }

                        const total = user.current_cart.reduce((a, c) => {
                            return a + c.quantity * c.item.price;
                        }, 0);

                        res.render("order/cart_form", {
                            title: "Cart",
                            cart_total: total,
                            user_cart: user.current_cart
                        });
                    });
                } else {
                    const total = user.current_cart.reduce((a, c) => {
                        return a + c.quantity * c.item.price;
                    }, 0);

                    res.render("order/cart_form", {
                        title: "Cart",
                        cart_total: total,
                        user_cart: user.current_cart
                    });
                }
            });
    }

    // changing the contents of the cart. doesn't modify orders, just the cart
};

// Handle order update on POST.
exports.order_update_post = function(req, res) {
    // res.send(req.body);
    if (req.user) {
        let user = req.user,
            cart = req.user.current_cart;

        cart.forEach((e, i) => {
            const q = parseInt(req.body.quantity[i]);
            if (q > 0) {
                e.quantity = q;
            }
        });

        if (req.body.cart) {
            cart = cart.filter(x => !req.body.cart.includes(x.item));
        }

        user.current_cart = cart;

        User.findByIdAndUpdate(user._id, user, {}, function(err, _user) {
            if (err) {
                return next(err);
            }
            // Successful - redirect to book detail page.
            res.redirect("/store/cart");
        });
    }

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
