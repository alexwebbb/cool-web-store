const Item_group = require("../models/item_group");
const Item = require("../models/item");
const async = require("async");

// Display list of all item_group.
exports.group_list = function(req, res) {
	res.send("NOT IMPLEMENTED: item_group list");
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
	res.send("NOT IMPLEMENTED: item_group create GET");
};

// Handle item_group create on POST.
exports.group_create_post = function(req, res) {
	res.send("NOT IMPLEMENTED: item_group create POST");
};

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
