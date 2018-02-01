const Item = require("../models/item"),
	Item_group = require("../models/item_group"),
	Order = require("../models/order"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter");

exports.index = function(req, res) {
	res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all items.
exports.item_list = function(req, res) {
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
exports.item_detail = function(req, res) {
	Item.findById(req.params.id).exec(function(err, item_detail) {
		if (err) return next(err);
		if (item_detail === null) {
			const err = new Error("Item not found");
			err.status = 404;
			return next(err);
		}
		res.render("item_detail", {
			title: "Item Detail",
			item_detail: item_detail
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
	// Convert the item groups to an array.
	(req, res, next) => {
		if (!(req.body.item_groups instanceof Array)) {
			if (typeof req.body.item_groups === "undefined")
				req.body.item_groups = [];
			else req.body.item_groups = new Array(req.body.item_groups);
		}
		next();
	},

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
		.escape(),

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
			// Data from form is valid.

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
exports.item_delete_get = function(req, res) {
	res.send("NOT IMPLEMENTED: item delete GET");
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item delete POST");
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
	// Get book, authors and genres for form.
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
			// Mark our selected genres as checked.
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
// basically the same as other post route... could use some refectoring
exports.item_update_post = [
	// Convert the item groups to an array.

	(req, res, next) => {
		if (!(req.body.item_groups instanceof Array)) {
			if (typeof req.body.item_groups === "undefined") {
				req.body.item_groups = [];
			} else req.body.item_groups = new Array(req.body.item_groups);
		}

		next();
	},
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
		.escape(),
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
					title: "Update Item",
					item_groups: item_group_list,
					item: item,
					errors: errors.array()
				});
			});

			return;
		} else {
			// Data from form is valid.

			console.log("data is valid");

			// Data from form is valid. Update the record.
			Item.findByIdAndUpdate(req.params.id, item, {}, function(
				err,
				itsAnItem
			) {
				if (err) {
					return next(err);
				}
				// Successful - redirect to book detail page.
				res.redirect(itsAnItem.url);
			});
		}
	}
];
