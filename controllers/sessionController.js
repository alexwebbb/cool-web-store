var Session = require('../models/session');

// Display list of all sessions.
exports.session_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Session list');
};

// Display detail page for a specific session.
exports.session_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Session detail: ' + req.params.id);
};

// Display session create form on GET.
exports.session_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Session create GET');
};

// Handle session create on POST.
exports.session_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session create POST');
};

// Handle session delete on POST.
exports.session_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session delete POST');
};

// Display session update form on GET.
exports.session_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Session update GET');
};

// Handle session update on POST.
exports.session_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session update POST');
};