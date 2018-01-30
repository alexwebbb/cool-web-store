const Item = require("../models/item"),
	Order = require("../models/order"),
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
	res.render("item_form", { title: "Create item" });
};

// Display item create form on post.
exports.item_create_post = [
	// Validate fields.
	body("item_name")
		.exists()
		.withMessage("item name must be specified.")
		.isLength({ min: 6, max: 24 })
		.withMessage("item name must be between 6 and 24 characters.")
		.isAscii()
		.withMessage("item name has non-alphanumeric characters."),
	body("description")
		.optional({ checkFalsy: true })
		.isLength({ max: 480 })
		.withMessage("description is too long."),
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

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("item_form", {
				title: "Create item",
				item: req.body,
				errors: errors.array()
			});
			return;
		} else {
			// Data from form is valid.

			// Create an item object with escaped and trimmed data.
			const item = new item({
				name: req.body.item_name,
				description: req.body.description,
				price_history: {
					price: req.body.price
				}
			});

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
	res.send("NOT IMPLEMENTED: item update GET");
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item update POST");
};
