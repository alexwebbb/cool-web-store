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
			.withMessage("Coupon name must be specified.")
			.isLength({ min: 6, max: 24 })
			.withMessage("Coupon name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("Coupon name has non-standard characters.")
			.custom(function(value, { req }) {
				// uniqueness validation
				return new Promise((resolve, reject) => {
					Coupon.findOne({ name: value }).exec(function(
						err,
						existing_coupon
					) {
						if (existing_coupon && !existing_coupon._id.equals(req.body.id)) {
							reject("Coupon name is not unique.");
						} else {
							resolve(value);
						}
					});
				});
			}),
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
		body("img_100")
			.optional({ checkFalsy: true })
			.isURL()
			.withMessage(
				"A reference to an image needs to be a url. A CDN would be ideal!"
			),

		// Sanitize fields.
		sanitizeBody("coupon_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape(),
		sanitizeBody("discount_percent")
			.trim()
			.escape(),
		sanitizeBody("img_100").trim()
	];

// Display coupon create form on GET.
exports.coupon_create_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		// retrieve all coupon groups for use in the form
		Item_group.find().exec(function(err, item_group_list) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render("coupon/form", {
				title: "Create Coupon",
				item_groups: item_group_list
			});
		});
	} else {
		res.redirect("/store/coupons");
	}
};

// Handle coupon create on POST.
exports.coupon_create_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create an coupon object with escaped and trimmed data.
				coupon = new Coupon({
					name: req.body.coupon_name,
					description: req.body.description,
					discount_percent: req.body.discount_percent,
					expirationDate: req.body.expirationDate,
					img_100: req.body.img_100,
					valid_item_groups: req.body.item_groups
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
							coupon.item_groups.indexOf(item_group_list[i]._id) >
							-1
						) {
							item_group_list[i].checked = "true";
						}
					}

					res.render("coupon/form", {
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
		} else {
			res.redirect("/store/coupons");
		}
	}
];

// Display coupon delete form on GET.
exports.coupon_delete_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		async.parallel(
			{
				coupon: function(callback) {
					Coupon.findById(req.params.id).exec(callback);
				},
				orders: function(callback) {
					Order.findOne({ coupons_present: req.body.id }).exec(
						callback
					);
				}
			},
			function(err, results) {
				if (err) return next(err);
				if (results.coupon === null) {
					const err = new Error("Coupon not found");
					err.status = 404;
					return next(err);
				}
				res.render("coupon/delete", {
					title: "Coupon Delete",
					orders: results.orders,
					coupon: results.coupon
				});
			}
		);
	} else {
		res.redirect("/store/coupons");
	}
};

// Handle coupon delete on POST.
exports.coupon_delete_post = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Coupon.findByIdAndRemove(req.body.id, function(err) {
			if (err) {
				return next(err);
			}
			// Success - go to coupon list
			res.redirect("/store/coupons");
		});
	} else {
		res.redirect("/store/coupons");
	}
};

// Display coupon update form on GET.
exports.coupon_update_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		// Get coupons and groups for form.
		async.parallel(
			{
				coupon: function(callback) {
					Coupon.findById(req.params.id)
						.populate("valid_item_groups")
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
						coupon_g_iter < results.coupon.valid_item_groups.length;
						coupon_g_iter++
					) {
						if (
							results.groups[all_g_iter]._id.toString() ==
							results.coupon.valid_item_groups[
								coupon_g_iter
							]._id.toString()
						) {
							results.groups[all_g_iter].checked = "true";
						}
					}
				}
				res.render("coupon/form", {
					title: "Update coupon",
					item_groups: results.groups,
					coupon: results.coupon
				});
			}
		);
	} else {
		res.redirect("/store/coupons");
	}
};

// Handle coupon update on POST.
exports.coupon_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create an coupon object with escaped and trimmed data.
				coupon = new Coupon({
					name: req.body.coupon_name,
					description: req.body.description,
					discount_percent: req.body.discount_percent,
					expirationDate: req.body.expirationDate,
					img_100: req.body.img_100,
					valid_item_groups: req.body.item_groups,
					_id: req.body.id
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
								coupon.item_groups.indexOf(
									results.groups[i]._id
								) > -1
							) {
								results.groups[i].checked = "true";
							}
						}

						res.render("coupon/form", {
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
		} else {
			res.redirect("/store/coupons");
		}
	}
];

// Display detail page for a specific coupon.
exports.coupon_detail = function(req, res, next) {
	Coupon.findById(req.params.id)
		.populate("valid_item_groups")
		.exec(function(err, coupon_detail) {
			if (err) return next(err);
			if (coupon_detail === null) {
				const err = new Error("Coupon not found");
				err.status = 404;
				return next(err);
			}
			res.render("coupon/detail", {
				title: "Coupon Detail",
				coupon_detail: coupon_detail
			});
		});
};

// Display list of all coupon.
exports.coupon_list = function(req, res, next) {
	Coupon.find({}, "name description discount_percent valid_range")
		.populate("valid_item_groups")
		.exec(function(err, coupon_list) {
			if (err) return next(err);

			res.render("coupon/list", {
				title: "Coupon List",
				coupon_list: coupon_list
			});
		});
};
