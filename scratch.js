// Display list of all orders.
exports.order_list = function(req, res) {
    res.send("NOT IMPLEMENTED: Order list");


    Order.find({}, "user createdAt")
        .exec(function(err, order_list) {
            if (err) return next(err);

            res.render("order/list", {
                title: "Order List",
                order_list: order_list
            });
        });
    // This will require
    // Orders (populate the user field)
    // user_id from request (filter order list based on current user)
    // date created
};