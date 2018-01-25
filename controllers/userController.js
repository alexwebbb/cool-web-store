const User = require("../models/user"),
	Order = require("../models/order");

// Display list of all users.
exports.user_list = function(req, res) {
	User.find().exec(function(err, user_list) {
		if (err) {
			return next(err);
		}
		//Successful, so render
		res.render("user_list", {
			title: "User List",
			user_list: user_list
		});
	});
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
	async.parallel(
		{
			user_detail: function(callback) {
				User.findById(req.params.id).exec(callback);
			},

			order_list: function(callback) {
				Order.find({ user: req.params.id })
				.populate("cart")
				.exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.user_detail == null) {
				// No results.
				var err = new Error("user not found");
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render("user_detail", {
				title: "User Detail",
				user_detail: results.user_detail,
				order_list: results.order_list
			});
		}
	);
};

// Display user create form on GET.
exports.user_create_get = function(req, res) {
	res.send("NOT IMPLEMENTED: user create GET");
};

// Handle user create on POST.
exports.user_create_post = function(req, res) {
	res.send("NOT IMPLEMENTED: user create POST");
};

// Handle user delete on POST.
exports.user_delete_get = function(req, res) {
	res.send("NOT IMPLEMENTED: user delete POST");
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
	res.send("NOT IMPLEMENTED: user delete POST");
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
	res.send("NOT IMPLEMENTED: user update GET");
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
	res.send("NOT IMPLEMENTED: user update POST");
};
