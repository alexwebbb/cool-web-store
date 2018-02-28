const Item_group = require("../models/item_group"),
	Item = require("../models/item"),
	Coupon = require("../models/coupon"),
	Order = require("../models/order"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter"),
	validateAndSanitizeFields = [
		// Validate fields.
		body("group_name")
			.exists()
			.withMessage("group name must be specified.")
			.isLength({ min: 3, max: 24 })
			.withMessage("group name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("group name has non-standard characters.")
			.custom(function(value, { req }) {
				// uniqueness validation
				return new Promise((resolve, reject) => {
					Item_group.findOne({ name: value }).exec(function(
						err,
						existing_group
					) {
						if (existing_group) {
							reject("Group name is not unique.");
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
		body("img_100")
			.optional({ checkFalsy: true })
			.isURL()
			.withMessage(
				"A reference to an image needs to be a url. A CDN would be ideal!"
			),
		// Sanitize fields.
		sanitizeBody("group_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape(),
		sanitizeBody("img_100").trim()
	];

// Display item_group create form on GET.
exports.group_create_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		res.render("group/form", { title: "Create Group" });
	} else {
		res.redirect("/store/groups");
	}
};

// Handle group create on POST.
exports.group_create_post = [
	...validateAndSanitizeFields,

	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create a group object with escaped and trimmed data.
				group = new Item_group({
					name: req.body.group_name,
					description: req.body.description,
					img_100: req.body.img_100
				});

			if (!errors.isEmpty()) {
				// There are errors. Render the form again with sanitized values/error messages.
				res.render("group/form", {
					title: "Create Group",
					group: group,
					errors: errors.array()
				});
				return;
			} else {
				// Data from form is valid.
				// Check if group with same name already exists.
				Item_group.findOne({ name: req.body.name }).exec(function(
					err,
					found_group
				) {
					if (err) {
						return next(err);
					}

					if (found_group) {
						// group exists, redirect to its detail page.
						res.redirect(found_group.url);
					} else {
						group.save(function(err) {
							if (err) {
								return next(err);
							}
							// group saved. Redirect to group detail page.
							res.redirect(group.url);
						});
					}
				});
			}
		} else {
			res.redirect("/store/groups");
		}
	}
];

// Display item_group delete form on GET.
exports.group_delete_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Item_group.findById(req.params.id).exec(function(err, group) {
			if (err) return next(err);
			if (results.item === null) {
				const err = new Error("Group not found");
				err.status = 404;
				return next(err);
			}
			res.render("group/delete", {
				title: "Group Delete",
				group: group
			});
		});
	} else {
		res.redirect("/store/groups");
	}
};

// Handle item_group delete on POST.
exports.group_delete_post = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Item_group.findByIdAndRemove(req.body.id, function(err) {
			if (err) {
				return next(err);
			}
			// Success - go to item list
			res.redirect("/store/groups");
		});
	} else {
		res.redirect("/store/groups");
	}
};

// Display item_group update form on GET.
exports.group_update_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Item_group.findById(req.params.id).exec(function(err, group) {
			if (err) {
				return next(err);
			}
			if (group == null) {
				// No results.
				const err = new Error("item not found");
				err.status = 404;
				return next(err);
			}
			// Success.

			res.render("group/form", {
				title: "Update group",
				group: group
			});
		});
	} else {
		res.redirect("/store/groups");
	}
};

// Handle item_group update on POST.
exports.group_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create a group object with escaped and trimmed data.
				group = new Item_group({
					name: req.body.group_name,
					description: req.body.description,
					img_100: req.body.img_100,
					_id: req.params.id
				});

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.

				// retrieve existing data since form data was invalid
				Item_group.findById(req.params.id).exec(function(err, group) {
					if (err) {
						return next(err);
					}

					res.render("group/form", {
						title: "Create Group",
						group: group,
						errors: errors.array()
					});
				});

				return;
			} else {
				// Data from form is valid. Update the record.
				Item_group.findByIdAndUpdate(req.params.id, group, {}, function(
					err,
					_group
				) {
					if (err) {
						return next(err);
					}
					// Successful - redirect to book detail page.
					res.redirect(_group.url);
				});
			}
		} else {
			res.redirect("/store/groups");
		}
	}
];

// Display detail page for a specific item_group.
exports.group_detail = function(req, res, next) {
	async.parallel(
		{
			item_group: function(callback) {
				Item_group.findById(req.params.id).exec(callback);
			},

			group_items: function(callback) {
				Item.find({ item_groups: req.params.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			if (results.item_group == null) {
				// No results.
				var err = new Error("item_group not found");
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render("group/detail", {
				title: "Item Group Detail",
				item_group: results.item_group,
				group_items: results.group_items
			});
		}
	);
};

// Display list of all item_groups.
exports.group_list = function(req, res, next) {
	Item_group.find({}, "name description img_100").exec(function(
		err,
		group_list
	) {
		if (err) return next(err);

		res.render("group/list", {
			title: "Group List",
			group_list: group_list
		});
	});
};
