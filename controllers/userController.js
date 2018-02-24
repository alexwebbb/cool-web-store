const User = require("../models/user"),
	Order = require("../models/order"),
	salt = require("password-hash-and-salt"),
	async = require("async"),
	{ rootCredentials: root } = require("../config/keys"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter"),
	validateAndSanitizeFields = [
		// Validate fields.
		body("username")
			.exists()
			.withMessage("Username must be specified.")
			.isLength({ min: 6, max: 24 })
			.withMessage("Username must be between 6 and 24 characters.")
			.isAlphanumeric()
			.withMessage("Username has non-alphanumeric characters."),
		body("password")
			.trim()
			.exists()
			.withMessage("Password must be specified.")
			.isLength({ min: 7, max: 256 })
			.withMessage("Password must be between 7 and 256 characters."),
		body("email")
			.exists()
			.withMessage("Email must be specified.")
			.isEmail()
			.withMessage("Email is in an invalid format."),
		body("first_name")
			.exists()
			.withMessage("First name must be specified.")
			.isLength({ max: 24 })
			.withMessage("First name is too long.")
			.isAlphanumeric()
			.withMessage("First name has non-alphanumeric characters."),
		body("middle_name")
			.optional({ checkFalsy: true })
			.isLength({ max: 24 })
			.withMessage("Middle name is too long.")
			.isAlphanumeric()
			.withMessage("Middle name has non-alphanumeric characters."),
		body("last_name")
			.exists()
			.withMessage("Last name must be specified.")
			.isLength({ max: 24 })
			.withMessage("Last name is too long.")
			.isAlphanumeric()
			.withMessage("Last name has non-alphanumeric characters."),

		// Sanitize fields.
		sanitizeBody("username")
			.trim()
			.escape(),
		sanitizeBody("password")
			.trim()
			.escape(),
		sanitizeBody("email")
			.trim()
			.escape()
			.normalizeEmail(),
		sanitizeBody("first_name")
			.trim()
			.escape(),
		sanitizeBody("middle_name")
			.trim()
			.escape(),
		sanitizeBody("last_name")
			.trim()
			.escape()
	];

// special function to run to create the root user
exports.start = function(req, res, next) {
	User.findOne({}).exec(function(err, users) {
		if (users) {
			res.redirect("/");
		} else {
			salt(root.password).hash(function(err, hash) {
				// Create a user object with escaped and trimmed data.
				const user = new User({
					username: root.user,
					hashedPassword: hash,
					email: "admin@null.com",
					names: {
						first_name: "admin",
						last_name: "account"
					},
					user_group: "admin"
				});

				user.save(function(err) {
					if (err) {
						return next(err);
					}
					// Successful - redirect to login screen
					res.redirect("/login");
				});
			});
		}
	});
};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {
	res.render("user/form", {
		title: "Create User",
		user: { group: "admin" }
	});
};

// Display user create form on post.
exports.user_create_post = [
	// Validate fields.
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (
			req.user._id.equals(req.params.id) ||
			req.user.user_group === "admin"
		) {
			// Extract the validation errors from a request.
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				res.render("user/form", {
					title: "Create User",
					user: req.body,
					errors: errors.array()
				});
				return;
			} else {
				salt(req.body.password).hash(function(err, hash) {
					// Create a user object with escaped and trimmed data.
					const user = new User({
						username: req.body.username,
						hashedPassword: hash,
						email: req.body.email,
						names: {
							first_name: req.body.first_name,
							middle_name: req.body.middle_name,
							last_name: req.body.last_name
						},
						user_group: req.body.admin ? "admin" : "user"
					});

					user.save(function(err) {
						if (err) {
							return next(err);
						}
						// Successful - redirect to new user record.
						res.redirect(user.url);
					});
				});
			}
		} else {
			res.redirect("/login");
		}
	}
];

// Handle user delete on POST.
exports.user_delete_get = function(req, res) {
	if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
		async.parallel(
			{
				user: function(callback) {
					User.findById(req.params.id).exec(callback);
				},
				orders: function(callback) {
					Order.findOne({ user: req.params.id }).exec(callback);
				},
				sessions: function(callback) {
					Session.findOne({ user: req.params.id }).exec(callback);
				}
			},
			function(err, results) {
				if (err) return next(err);
				if (results.user === null) {
					const err = new Error("Item not found");
					err.status = 404;
					return next(err);
				}
				res.render("user/delete", {
					title: "User Delete",
					sessions: results.sessions,
					orders: results.orders,
					user: results.user
				});
			}
		);
	} else {
		res.redirect("/login");
	}
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
	if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
		async.parallel(
			{
				user: function(callback) {
					User.findById(req.params.id).exec(callback);
				},
				orders: function(callback) {
					Order.findOne({ user: req.params.id }).exec(callback);
				}
			},
			function(err, results) {
				if (err) {
					return next(err);
				}
				// Success
				if (results.orders) {
					// in order to prevent corrupting orders or sessions, items in use are protected
					res.render("error", {
						message: "Delete User Error - User in use",
						error: {
							status: `There are ${
								results.orders
							} orders with existing records of this user. Thus, the user cannot be deleted. If you need to remove the user from the store, please change the 'active' property to false.`
						}
					});
					return;
				} else {
					// User is unused. It may be deleted
					User.findByIdAndRemove(req.body.id, function(err) {
						if (err) {
							return next(err);
						}

						if (req.user.user_group === "admin") {
							// Success - go to user list
							res.redirect("/users");
						} else {
							// User Has deleted themself, log them out
							req.logout();
							res.redirect("/");
						}
					});
				}
			}
		);
	} else {
		res.redirect("/login");
	}
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
	if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
		User.findById(req.params.id).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			if (user == null) {
				// No results.
				const err = new Error("item not found");
				err.status = 404;
				return next(err);
			}
			// Success.
			res.render("user/form", {
				title: "Update user",
				user: user
			});
		});
	} else {
		res.redirect("/login");
	}
};

// Handle user update on POST.
exports.user_update_post = [
	...validateAndSanitizeFields,
	(req, res, next) => {
		if (
			req.user._id.equals(req.params.id) ||
			req.user.user_group === "admin"
		) {
			const errors = validationResult(req),
				user = new User({
					username: req.body.username,
					hashedPassword: hash,
					email: req.body.email,
					names: {
						first_name: req.body.first_name,
						middle_name: req.body.middle_name,
						last_name: req.body.last_name
					}
				});

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.

				// retrieve existing data since form data was invalid
				User.findById(req.params.id).exec(function(err, user) {
					if (err) {
						return next(err);
					}

					res.render("user/form", {
						title: "Update Item",
						user: user,
						errors: errors.array()
					});
				});

				return;
			} else {
				// Data from form is valid. Update the record.
				User.findByIdAndUpdate(req.params.id, user, {}, function(
					err,
					_user
				) {
					if (err) {
						return next(err);
					}
					// Successful - redirect to book detail page.
					res.redirect(_user.url);
				});
			}
		} else {
			res.redirect("/login");
		}
	}
];

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
	if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
		async.parallel(
			{
				user: function(callback) {
					User.findById(req.params.id).exec(callback);
				},
				orders: function(callback) {
					Order.find(
						{ user: req.params.id },
						"total created_at"
					).exec(callback);
				}
			},
			function(err, results) {
				if (err) return next(err);
				if (results.user == null) {
					// No results.
					const err = new Error("user not found");
					err.status = 404;
					return next(err);
				}
				// Successful, so render
				res.render("user/detail", {
					title: "User Detail",
					user_detail: results.user,
					order_list: results.orders
				});
			}
		);
	} else {
		res.redirect("/login");
	}
};

// Display list of all users.
exports.user_list = function(req, res) {
	if (req.user.user_group === "admin") {
		User.find().exec(function(err, user_list) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render("user/list", {
				title: "User List",
				user_list: user_list
			});
		});
	} else {
		res.redirect("/login");
	}
};
