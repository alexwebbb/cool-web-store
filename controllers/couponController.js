var Coupon = require('../models/coupon');

// Display list of all coupon.
exports.coupon_list = function(req, res) {
    Coupon.find({}, "name description discount_percent valid_item_groups")
		.populate("valid_item_groups")
		.exec(function(err, coupon_list) {
			if (err) return next(err);

			res.render("coupon_list", {
				title: "Coupon List",
				coupon_list: coupon_list
			});
		});
};

// Display detail page for a specific coupon.
exports.coupon_detail = function(req, res) {
    Coupon.findById(req.params.id)
    	.populate("valid_item_groups")
		.exec(function(err, coupon_detail) {
			if (err) return next(err);
			if (coupon_detail === null) {
				const err = new Error("Item not found");
				err.status = 404;
				return next(err);
			}
			res.render("coupon_detail", {
				title: "Coupon Detail",
				coupon_detail: coupon_detail
			});
		});
};


// Display coupon create form on GET.
exports.coupon_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon create GET');
};

// Handle coupon create on POST.
exports.coupon_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon create POST');
};

// Display coupon delete form on GET.
exports.coupon_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon delete GET');
};

// Handle coupon delete on POST.
exports.coupon_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon delete POST');
};

// Display coupon update form on GET.
exports.coupon_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon update GET');
};

// Handle coupon update on POST.
exports.coupon_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Coupon update POST');
};