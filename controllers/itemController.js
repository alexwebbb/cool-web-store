const Item = require("../models/item"),
	Item_group = require("../models/item_group"),
	User = require("../models/user"),
	Order = require("../models/order"),
	Session = require("../models/session"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter"),
	validateAndSanitizeFields = [
		// Validate fields.
		body("item_name")
			.exists()
			.withMessage("Item name must be specified.")
			.isLength({ min: 3, max: 24 })
			.withMessage("Item name must be between 6 and 24 characters.")
			.isAscii()
			.withMessage("Item name has non-standard characters.")
			.custom(function(value, { req }) {
				// uniqueness validation
				return new Promise((resolve, reject) => {
					Item.findOne({ name: value }).exec(function(
						err,
						existing_item
					) {
						if (existing_item && !existing_item._id.equals(req.body.id)) {
							reject("Item name is not unique.");
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
		body("price")
			.optional({ checkFalsy: true })
			.isLength({ max: 124 })
			.withMessage("price is too long.")
			.isCurrency()
			.withMessage("price has non-numeric characters."),
		body("img_100")
			.optional({ checkFalsy: true })
			.isURL()
			.withMessage(
				"A reference to an image needs to be a url. A CDN would be ideal!"
			),
		body("img_700_400")
			.optional({ checkFalsy: true })
			.isURL()
			.withMessage(
				"A reference to an image needs to be a url. A CDN would be ideal!"
			),

		// Sanitize fields.
		sanitizeBody("item_name")
			.trim()
			.escape(),
		sanitizeBody("description")
			.trim()
			.escape(),
		sanitizeBody("price")
			.trim()
			.escape(),
		sanitizeBody("img_100").trim(),
		sanitizeBody("img_700_400").trim()
	];

exports.index = function(req, res, next) {
	async.parallel(
		{
			item_list: function(callback) {
				Item.find(
					{},
					"name description price_history availability img_700_400"
				)
					.populate("item_groups")
					.exec(callback);
			},
			item_groups: function(callback) {
				Item_group.find(callback);
			}
		},
		function(err, results) {
			if (err) return next(err);

			res.render("item/index", {
				title: "Item Store",
				item_groups: results.item_groups,
				item_list: results.item_list
			});
		}
	);
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		// retrieve all item groups for use in the form
		Item_group.find().exec(function(err, item_group_list) {
			if (err) {
				return next(err);
			}
			//Successful, so render
			res.render("item/form", {
				title: "Create Item",
				item_groups: item_group_list
			});
		});
	} else {
		res.redirect("/store/items");
	}
};

// Display item create form on post.
exports.item_create_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			console.log(req.body);
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create an item object with escaped and trimmed data.
				item = new Item({
					name: req.body.item_name,
					description: req.body.description,
					price: req.body.price,
					img_100: req.body.img_100,
					img_700_400: req.body.img_700_400,
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
						if (
							item.item_groups.indexOf(item_group_list[i]._id) >
							-1
						) {
							item_group_list[i].checked = "true";
						}
					}

					res.render("item/form", {
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
		} else {
			res.redirect("/store/items");
		}
	}
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
		async.parallel(
			{
				item: function(callback) {
					Item.findById(req.params.id).exec(callback);
				},
				orders: function(callback) {
					Order.findOne({ "cart.item": req.params.id }).exec(
						callback
					);
				}
			},
			function(err, results) {
				if (err) return next(err);
				if (results.item === null) {
					const err = new Error("Item not found");
					err.status = 404;
					return next(err);
				}
				res.render("item/delete", {
					title: "Item Delete",
					orders: results.orders,
					item: results.item
				});
			}
		);
	} else {
		res.redirect("/store/items");
	}
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res, next) {
	if (req.user.user_group === "admin") {
		if (err) {
			return next(err);
		}

		// Item is unused. It may be deleted
		Item.findByIdAndRemove(req.body.id, function(err) {
			if (err) {
				return next(err);
			}
			// Success - go to item list
			res.redirect("/store/items");
		});
	} else {
		res.redirect("/store/items");
	}
};

// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
	if (req.user.user_group === "admin") {
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
				res.render("item/form", {
					title: "Update item",
					item_groups: results.groups,
					item: results.item
				});
			}
		);
	} else {
		res.redirect("/store/items");
	}
};

// Handle item update on POST.
exports.item_update_post = [
	...validateAndSanitizeFields,
	// Process request after validation and sanitization.
	(req, res, next) => {
		if (req.user.user_group === "admin") {
			console.log(req.body);
			// Extract the validation errors from a request.
			const errors = validationResult(req),
				// Create an item object with escaped and trimmed data.
				item = new Item({
					name: req.body.item_name,
					description: req.body.description,
					price: req.body.price,
					img_100: req.body.img_100,
					img_700_400: req.body.img_700_400,
					item_groups: req.body.item_groups,
					_id: req.body.id
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
								item.item_groups.indexOf(
									results.groups[i]._id
								) > -1
							) {
								results.groups[i].checked = "true";
							}
						}

						res.render("item/form", {
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
		} else {
			res.redirect("/store/items");
		}
	}
];

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
	Item.findById(req.params.id)
		.populate("item_groups")
		.exec(function(err, item) {
			if (err) return next(err);
			if (item === null) {
				const err = new Error("Item not found");
				err.status = 404;
				return next(err);
			}
			if (req.user) {
				User.findById(req.user._id).exec(function(err, user) {
					user.current_view = req.params.id;
					user.save().then(function(res) {
						console.log("session updated");
					});
				});
			}

			res.render("item/detail", {
				title: "Item Detail",
				item: item
			});
		});
};

// Display list of all items.
exports.item_list = function(req, res, next) {
	Item.find({}, "name description price_history availability img_100")
		.populate("item_groups")
		.exec(function(err, item_list) {
			if (err) return next(err);

			res.render("item/list", {
				title: "Item List",
				item_list: item_list
			});
		});
};
