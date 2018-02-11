var Session = require("../models/session");

// Display list of all sessions.
exports.session_list = function(req, res) {
	Session.find({}, "user views")
		.populate("user")
		.populate("views.item")
		.exec(function(err, session_list) {
			res.send(session_list);
		});
};

// Display detail page for a specific session.
exports.session_detail = function(req, res) {
	Session.find({}, "user views")
		.populate("user")
		.populate("views.item")
		.exec(function(err, session_list) {
			res.send(session_list);
		});
};
