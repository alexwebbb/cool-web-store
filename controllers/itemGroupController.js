const Item_group = require("../models/item_group"),
	Item = require("../models/item"),
	async = require("async"),
	{ body, validationResult } = require("express-validator/check"),
	{ sanitizeBody } = require("express-validator/filter");

// Display list of all item_group.
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
	// Validate that the name field is not empty.
	body("name", "Group name required")
		.isLength({ min: 1 })
		.trim(),

	// Sanitize (trim and escape) the name field.
	sanitizeBody("name")
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req),
			// Create a genre object with escaped and trimmed data.
			group = new Item_group({ name: req.body.name });

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
	res.send("NOT IMPLEMENTED: item_group delete GET");
};

// Handle item_group delete on POST.
exports.group_delete_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item_group delete POST");
};

// Display item_group update form on GET.
exports.group_update_get = function(req, res) {
	res.send("NOT IMPLEMENTED: item_group update GET");
};

// Handle item_group update on POST.
exports.group_update_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item_group update POST");
};
