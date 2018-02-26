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
    User.findById(req.user._id, "current_cart")
        .populate("current_cart.item")
        .populate("current_cart.item.price_history.price")
        .exec(function(err, user) {
            if (err) return next(err);
            if (user === null) {
                const err = new Error("User not found");
                err.status = 404;
                return next(err);
            }

            const total = user.current_cart.reduce((a, c) => {
                    return a + c.quantity * c.item.price;
                }, 0),
                totalTimes100 = total * 100,
                newCart = user.current_cart.map(function(element) {
                    const item = element.item;
                    return {
                        item: {
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            img_100: item.img_100,
                            img_700_400: item.img_700_400,
                            item_groups: item.item_groups,
                            id: item._id
                        },
                        quantity: element.quantity
                    };
                }),
                order = new Order({
                    user: req.user._id,
                    cart: newCart,
                    total: total
                });

            async.series(
                [
                    function(callback) {
                        // submit charge to stripe servers
                        stripe.customers
                            .create({
                                email: req.body.stripeEmail,
                                source: req.body.stripeToken
                            })
                            .then(customer => {
                                stripe.charges.create({
                                    totalTimes100,
                                    description: "Sample Charge",
                                    currency: "usd",
                                    customer: customer.id
                                });
                            })
                            .then(charge => {
                                callback(null, charge);
                            });
                    },
                    function(callback) {
                        // create an order from the cart
                        order.save(function(err) {
                            if (err) {
                                console.log(err);
                                return next(err);
                            }
                            callback(null);
                        });
                    },
                    function(callback) {
                        // remove the cart from the user object
                        user.current_cart = [];
                        user.save().then(function(res) {
                            console.log("cart cleared");
                            callback(null);
                        });
                    }
                ],
                // optional callback
                function(err, results) {
                    // Successful - redirect to confirmation screen.
                    res.render("order/charge_result", {
                        title: "Payment Complete",
                        total: total,
                        charge: results
                    });
                }
            );
        });

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
                    user.current_cart = user.current_cart.filter(
                        x => x.item !== null
                    );
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

// Display detail page for a specific order.
exports.order_detail = function(req, res) {
    if (req.user.id === req.params.id || req.user.user_group === "admin") {
        Order.findById(req.params.id)
            .populate("user")
            .exec(function(err, order) {
                if (err) return next(err);
                if (order === null) {
                    const err = new Error("Order not found");
                    err.status = 404;
                    return next(err);
                }

                res.render("order/detail", {
                    title: "Order Detail",
                    user_cart: order.cart,
                    cart_total: order.total,
                    user: order.user
                });
            });
    }
};

// Display list of all orders.
exports.order_list = function(req, res) {
    if (req.user.user_group === "admin") {
        Order.find({}, "user total created_at")
            .populate("user")
            .exec(function(err, order_list) {
                if (err) return next(err);

                res.render("order/list", {
                    title: "Order List",
                    order_list: order_list
                });
            });
    }
};
