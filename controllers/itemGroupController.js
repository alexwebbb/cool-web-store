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
			.isLength({ min: 6, max: 24 })
			.withMessage("group name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("group name has non-standard characters."),
		body("description")
			.optional({ checkFalsy: true })
			.isLength({ max: 480 })
			.withMessage("description is too long.")
			.isAscii()
			.withMessage("description has non-standard characters."),
		// Sanitize fields.
		sanitizeBody("group_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape()
	];

// Display list of all item_groups.
exports.group_list = function(req, res) {
	Item_group.find({}, "name description").exec(function(err, group_list) {
		if (err) return next(err);

		res.render("group_list", {
			title: "Group List",
			group_list: group_list
		});
	});
};

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
			res.render("group_detail", {
				title: "Item Group Detail",
				item_group: results.item_group,
				group_items: results.group_items
			});
		}
	);
};

// Display item_group create form on GET.
exports.group_create_get = function(req, res) {
	res.render("group_form", { title: "Create Group" });
};

// Handle group create on POST.
exports.group_create_post = [
	...validateAndSanitizeFields,

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req),
			// Create a group object with escaped and trimmed data.
			group = new Item_group({
			name: req.body.group_name,
			description: req.body.description
		});

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render("group_form", {
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
	}
];

// Display item_group delete form on GET.
exports.group_delete_get = function(req, res) {
	async.parallel(
		{
			group: function(callback) {
				Item_group.findById(req.params.id).exec(callback);
			},
			items: function(callback) {
				Item.findOne({ item_groups: req.params.id }).exec(callback);
			},
			coupons: function(callback) {
				Coupon.findOne({ valid_item_groups: req.params.id }).exec(
					callback
				);
			},
			orders: function(callback) {
				Order.findOne({ item_groups_present: req.params.id }).exec(
					callback
				);
			}
		},
		function(err, results) {
			if (err) return next(err);
			if (results.item === null) {
				const err = new Error("Group not found");
				err.status = 404;
				return next(err);
			}
			res.render("group_delete", {
				title: "Group Delete",
				orders: results.orders,
				coupons: results.coupons,
				items: results.items,
				group: results.group
			});
		}
	);
};

// Handle item_group delete on POST.
exports.group_delete_post = function(req, res) {
	async.parallel(
		{
			group: function(callback) {
				Item_group.findById(req.params.id).exec(callback);
			},
			items: function(callback) {
				Item.findOne({ item_groups: req.params.id }).exec(callback);
			},
			coupons: function(callback) {
				Coupon.findOne({ valid_item_groups: req.params.id }).exec(
					callback
				);
			},
			orders: function(callback) {
				Order.findOne({ item_groups_present: req.params.id }).exec(
					callback
				);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			// Success
			if (results.orders || results.coupons || results.items) {
				// in order to prevent corrupting orders, groups in use are protected
				res.render("error", {
					message: "Delete Group Error - Group in use",
					error: {
						status: `There are ${
							results.sessions ? "items, " : ""
						} ${
							results.sessions ? "coupons, " : ""
						} ${
							results.orders ? "and orders" : ""
						}  with existing records of this item. Thus, the item cannot be deleted. If you need to remove the item from the store, please change the 'active' property to false.`
					}
				});
				return;
			} else {
				// Group is unused. It may be deleted
				Item_group.findByIdAndRemove(req.body.id, function(err) {
					if (err) {
						return next(err);
					}
					// Success - go to item list
					res.redirect("/store/groups");
				});
			}
		}
	);
};

// Display item_group update form on GET.
exports.group_update_get = function(req, res) {
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
			
			res.render("group_form", {
				title: "Update group",
				group: group
			});
		}
	);
};

// Handle item_group update on POST.
exports.group_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req),
			// Create a group object with escaped and trimmed data.
			group = new Item_group({
			name: req.body.group_name,
			description: req.body.description
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// retrieve existing data since form data was invalid
			Item_group.findById(req.params.id).exec(function(err, group) {
					if (err) {
						return next(err);
					}

					res.render("group_form", {
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
	}

];
