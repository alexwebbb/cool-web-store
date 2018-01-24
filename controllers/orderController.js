var Order = require('../models/order');

// Display list of all orders.
exports.order_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Order list');
};

// Display detail page for a specific order.
exports.order_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Order detail: ' + req.params.id);
};

// Display order create form on GET.
exports.order_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Order create GET');
};

// Handle order create on POST.
exports.order_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order create POST');
};

// Handle order delete on POST.
exports.order_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order delete POST');
};

// Display order update form on GET.
exports.order_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Order update GET');
};

// Handle order update on POST.
exports.order_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order update POST');
};