const Item = require("../models/item"),
	Item_group = require("../models/item_group"),
	Order = require("../models/order"),
	Session = require("../models/session"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter"),
	validateAndSanitizeFields = [
		// Validate fields.
		body("item_name")
			.exists()
			.withMessage("item name must be specified.")
			.isLength({ min: 6, max: 24 })
			.withMessage("item name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("item name has non-standard characters."),
		body("description")
			.optional({ checkFalsy: true })
			.isLength({ max: 480 })
			.withMessage("description is too long.")
			.isAscii()
			.withMessage("item name has non-standard characters."),
		body("price")
			.optional({ checkFalsy: true })
			.isLength({ max: 124 })
			.withMessage("price is too long.")
			.isCurrency()
			.withMessage("price has non-numeric characters."),

		// Sanitize fields.
		sanitizeBody("item_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape(),
		sanitizeBody("price")
			.trim()
			.escape()
	];

exports.index = function(req, res, next) {
	res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all items.
exports.item_list = function(req, res, next) {
	Item.find({}, "name description price_history")
		.populate("item_groups")
		.exec(function(err, item_list) {
			if (err) return next(err);

			res.render("item_list", {
				title: "Item List",
				item_list: item_list
			});
		});
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
	Item.findById(req.params.id).exec(function(err, item) {
		if (err) return next(err);
		if (item === null) {
			const err = new Error("Item not found");
			err.status = 404;
			return next(err);
		}
		res.render("item_detail", {
			title: "Item Detail",
			item: item
		});
	});
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
	// retrieve all item groups for use in the form
	Item_group.find().exec(function(err, item_group_list) {
		if (err) {
			return next(err);
		}
		//Successful, so render
		res.render("item_form", {
			title: "Create Item",
			item_groups: item_group_list
		});
	});
};

// Display item create form on post.
exports.item_create_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create an item object with escaped and trimmed data.
		const item = new Item({
			name: req.body.item_name,
			description: req.body.description,
			price: req.body.price,
			item_groups: req.body.item_groups
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// retrieve all item groups for use in the form
			Item_group.find().exec(function(err, item_group_list) {
				if (err) {
					return next(err);
				}

				// Mark our selected item groups as checked.
				for (let i = 0; i < item_group_list.length; i++) {
					if (item.item_groups.indexOf(item_group_list[i]._id) > -1) {
						item_group_list[i].checked = "true";
					}
				}

				res.render("item_form", {
					title: "Create Item",
					item_groups: item_group_list,
					item: req.body,
					errors: errors.array()
				});
			});

			return;
		} else {
			// Data from form is valid. Save the record
			item.save(function(err) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to new item record.
				res.redirect(item.url);
			});
		}
	}
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res, next) {
	async.parallel(
		{
			item: function(callback) {
				Item.findById(req.params.id).exec(callback);
			},
			orders: function(callback) {
				Order.findOne({ "cart.item_id": req.params.id }).exec(callback);
			},
			sessions: function(callback) {
				Session.findOne({ "views.item_id": req.params.id }).exec(callback);
			}
		},
		function(err, results) {
			if (err) return next(err);
			if (results.item === null) {
				const err = new Error("Item not found");
				err.status = 404;
				return next(err);
			}
			res.render("item_delete", {
				title: "Item Delete",
				sessions: results.sessions,
				orders: results.orders,
				item: results.item
			});
		}
	);
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res, next) {
	async.parallel(
		{
			item: function(callback) {
				Item.findById(req.body.id).exec(callback);
			},
			orders: function(callback) {
				Order.findOne({ "cart.item_id": req.body.id }).exec(callback);
			},
			sessions: function(callback) {
				Session.findOne({ "views.item_id": req.body.id }).exec(
					callback
				);
			}
		},
		function(err, results) {
			if (err) {
				return next(err);
			}
			// Success
			if (results.orders || results.sessions) {
				// in order to prevent corrupting orders or sessions, items in use are protected
				res.render("error", {
					message: "Delete Item Error - Item in use",
					error: {
						status: `There are ${
							results.sessions ? "sessions" : ""
						} ${
							results.orders ? "and orders" : ""
						}  with existing records of this item. Thus, the item cannot be deleted. If you need to remove the item from the store, please change the 'active' property to false.`
					}
				});
				return;
			} else {
				// Item is unused. It may be deleted
				Item.findByIdAndRemove(req.body.id, function(err) {
					if (err) {
						return next(err);
					}
					// Success - go to item list
					res.redirect("/store/items");
				});
			}
		}
	);
};

// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
	// Get items and groups for form.
	async.parallel(
		{
			item: function(callback) {
				Item.findById(req.params.id)
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
			if (results.item == null) {
				// No results.
				const err = new Error("item not found");
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
					let item_g_iter = 0;
					item_g_iter < results.item.item_groups.length;
					item_g_iter++
				) {
					if (
						results.groups[all_g_iter]._id.toString() ==
						results.item.item_groups[item_g_iter]._id.toString()
					) {
						results.groups[all_g_iter].checked = "true";
					}
				}
			}
			res.render("item_form", {
				title: "Update item",
				item_groups: results.groups,
				item: results.item
			});
		}
	);
};

// Handle item update on POST.
exports.item_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create an item object with escaped and trimmed data.
		const item = new Item({
			name: req.body.item_name,
			description: req.body.description,
			price: req.body.price,
			item_groups: req.body.item_groups,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// retrieve existing data since form data was invalid
			async.parallel(
				{
					item: function(callback) {
						Item.findById(req.params.id)
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

					// Mark our selected item groups as checked.
					for (let i = 0; i < results.groups.length; i++) {
						if (
							item.item_groups.indexOf(results.groups[i]._id) > -1
						) {
							results.groups[i].checked = "true";
						}
					}

					res.render("item_form", {
						title: "Update Item",
						item_groups: results.groups,
						item: results.item,
						errors: errors.array()
					});
				}
			);

			return;
		} else {
			// Data from form is valid. Update the record.
			Item.findByIdAndUpdate(req.params.id, item, {}, function(
				err,
				_item
			) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to book detail page.
				res.redirect(_item.url);
			});
		}
	}
];
