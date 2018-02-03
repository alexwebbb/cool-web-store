const Coupon = require("../models/coupon"),
	Item_group = require("../models/item_group"),
	Order = require("../models/order"),
	Session = require("../models/session"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter"),
	validateAndSanitizeFields = [
		// Validate fields.
		body("coupon_name")
			.exists()
			.withMessage("coupon name must be specified.")
			.isLength({ min: 6, max: 24 })
			.withMessage("coupon name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("coupon name has non-standard characters."),
		body("description")
			.optional({ checkFalsy: true })
			.isLength({ max: 480 })
			.withMessage("description is too long.")
			.isAscii()
			.withMessage("description has non-standard characters."),
		body("discount_percent")
			.exists()
			.withMessage("discount percent field is empty")
			.isFloat({ min: 0, max: 100 })
			.withMessage("discount percent is out of range"),

		// Sanitize fields.
		sanitizeBody("coupon_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape(),
		sanitizeBody("discount_percent")
			.trim()
			.escape()
	];

// Display list of all coupon.
exports.coupon_list = function(req, res) {
	Coupon.find({}, "name description discount_percent valid_item_groups")
		.populate("valid_item_groups")
		.exec(function(err, coupon_list) {
			if (err) return next(err);

			res.render("coupon_list", {
				title: "Coupon List",
				coupon_list: coupon_list
			});
		});
};

// Display detail page for a specific coupon.
exports.coupon_detail = function(req, res) {
	Coupon.findById(req.params.id)
		.populate("valid_item_groups")
		.exec(function(err, coupon_detail) {
			if (err) return next(err);
			if (coupon_detail === null) {
				const err = new Error("Coupon not found");
				err.status = 404;
				return next(err);
			}
			res.render("coupon_detail", {
				title: "Coupon Detail",
				coupon_detail: coupon_detail
			});
		});
};

// Display coupon create form on GET.
exports.coupon_create_get = function(req, res) {
	// retrieve all coupon groups for use in the form
	Item_group.find().exec(function(err, item_group_list) {
		if (err) {
			return next(err);
		}
		//Successful, so render
		res.render("coupon_form", {
			title: "Create Coupon",
			item_groups: item_group_list
		});
	});
};

// Handle coupon create on POST.
exports.coupon_create_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req),
			// Create an coupon object with escaped and trimmed data.
			coupon = new Coupon({
				name: req.body.coupon_name,
				description: req.body.description,
				discount_percent: req.body.discount_percent,
				expiration_date: req.body.expiration_date,
				item_groups: req.body.item_groups
			});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// retrieve all coupon groups for use in the form
			Item_group.find().exec(function(err, item_group_list) {
				if (err) {
					return next(err);
				}

				// Mark our selected coupon groups as checked.
				for (let i = 0; i < item_group_list.length; i++) {
					if (
						coupon.item_groups.indexOf(item_group_list[i]._id) > -1
					) {
						item_group_list[i].checked = "true";
					}
				}

				res.render("coupon_form", {
					title: "Create Coupon",
					item_groups: item_group_list,
					coupon: req.body,
					errors: errors.array()
				});
			});

			return;
		} else {
			// Data from form is valid. Save the record
			coupon.save(function(err) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to new coupon record.
				res.redirect(coupon.url);
			});
		}
	}
];

// Display coupon delete form on GET.
exports.coupon_delete_get = function(req, res, next) {
	async.parallel(
		{
			coupon: function(callback) {
				Coupon.findById(req.params.id).exec(callback);
			},
			orders: function(callback) {
				Order.findOne({ coupons_present: req.body.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) return next(err);
			if (results.coupon === null) {
				const err = new Error("Coupon not found");
				err.status = 404;
				return next(err);
			}
			res.render("coupon_delete", {
				title: "Coupon Delete",
				orders: results.orders,
				coupon: results.coupon
			});
		}
	);
};

// Handle coupon delete on POST.
exports.coupon_delete_post = function(req, res, next) {
	async.parallel(
		{
			coupon: function(callback) {
				Coupon.findById(req.body.id).exec(callback);
			},
			orders: function(callback) {
				Order.findOne({ coupons_present: req.body.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}

			// Success
			if (results.orders || results.sessions) {
				// in order to prevent corrupting orders or sessions, coupons in use are protected
				res.render("error", {
					message: "Delete Coupon Error - Coupon in use",
					error: {
						status: `There are orders with existing records of this coupon. Thus, the coupon cannot be deleted. If you need to remove the coupon from the store, please change the 'active' property to false.`
					}
				});
				return;
			} else {
				// Coupon is unused. It may be deleted
				Coupon.findByIdAndRemove(req.body.id, function(err) {
					if (err) {
						return next(err);
					}
					// Success - go to coupon list
					res.redirect("/store/coupons");
				});
			}
		}
	);
};

// Display coupon update form on GET.
exports.coupon_update_get = function(req, res, next) {
	// Get coupons and groups for form.
	async.parallel(
		{
			coupon: function(callback) {
				Coupon.findById(req.params.id)
					.populate("item_groups")
					.exec(callback);
			},
			groups: function(callback) {
				Item_group.find(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.coupon == null) {
				// No results.
				const err = new Error("coupon not found");
				err.status = 404;
				return next(err);
			}
			// Success.
			// Mark our selected groups as checked.
			for (
				let all_g_iter = 0;
				all_g_iter < results.groups.length;
				all_g_iter++
			) {
				for (
					let coupon_g_iter = 0;
					coupon_g_iter < results.coupon.item_groups.length;
					coupon_g_iter++
				) {
					if (
						results.groups[all_g_iter]._id.toString() ==
						results.coupon.item_groups[coupon_g_iter]._id.toString()
					) {
						results.groups[all_g_iter].checked = "true";
					}
				}
			}
			res.render("coupon_form", {
				title: "Update coupon",
				item_groups: results.groups,
				coupon: results.coupon
			});
		}
	);
};

// Handle coupon update on POST.
exports.coupon_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req),
			// Create an coupon object with escaped and trimmed data.
			coupon = new Coupon({
				name: req.body.coupon_name,
				description: req.body.description,
				discount_percent: req.body.discount_percent,
				expiration_date: req.body.expiration_date,
				item_groups: req.body.item_groups,
				_id: req.params.id
			});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// retrieve existing data since form data was invalid
			async.parallel(
				{
					coupon: function(callback) {
						Coupon.findById(req.params.id)
							.populate("item_groups")
							.exec(callback);
					},
					groups: function(callback) {
						Item_group.find(callback);
					}
				},
				function(err, results) {
					if (err) {
						return next(err);
					}

					// Mark our selected coupon groups as checked.
					for (let i = 0; i < results.groups.length; i++) {
						if (
							coupon.item_groups.indexOf(results.groups[i]._id) >
							-1
						) {
							results.groups[i].checked = "true";
						}
					}

					res.render("coupon_form", {
						title: "Update Coupon",
						item_groups: results.groups,
						coupon: results.coupon,
						errors: errors.array()
					});
				}
			);

			return;
		} else {
			// Data from form is valid. Update the record.
			Coupon.findByIdAndUpdate(req.params.id, coupon, {}, function(
				err,
				_coupon
			) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to book detail page.
				res.redirect(_coupon.url);
			});
		}
	}
];
