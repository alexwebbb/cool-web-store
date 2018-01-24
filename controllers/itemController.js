var Item = require("../models/item");

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
	Item.findById(req.params.id)
		.exec(function(err, item_detail) {
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
exports.item_create_get = function(req, res) {
	res.send("NOT IMPLEMENTED: item create GET");
};

// Handle item create on POST.
exports.item_create_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item create POST");
};

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
