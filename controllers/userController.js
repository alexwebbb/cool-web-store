const User = require("../models/user"),
	Order = require("../models/order"),
	salt = require("password-hash-and-salt"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter");

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
	User.findById(req.params.id)
		.populate({
			path: "orders",
			populate: { path: "cart" }
		})
		.exec(function(err, user_detail) {
			if (err) return next(err);
			if (user_detail == null) {
				// No results.
				const err = new Error("user not found");
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render("user_detail", {
				title: "User Detail",
				user_detail: user_detail
			});
		});
};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {
	res.render("user_form", { title: "Create User" });
};

// Display user create form on post.
exports.user_create_post = [
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
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("user_form", {
				title: "Create User",
				user: req.body,
				errors: errors.array()
			});
			return;
		} else {
			salt(req.body.password).hash(function(err, hash) {
				// Create an user object with escaped and trimmed data.
				const user = new User({
					username: req.body.username,
					hashedPassword: hash,
					email: req.body.email,
					names: {
						first_name: req.body.first_name,
						middle_name: req.body.middle_name,
						last_name: req.body.last_name
					}
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
	}
];

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
