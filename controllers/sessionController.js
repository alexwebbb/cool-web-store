var Session = require("../models/session");

// Display list of all sessions.
exports.session_list = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Session.find({}, "user views")
			.populate("user")
			.populate("views.item")
			.exec(function(err, session_list) {

				const data = session_list.map(({user, views}) => {
					return {
						name: user.name,
						views: views.map((v) => {
							return v.item.name;
						})
					};
				})


				res.send(data);
			});
	}
};

// Display detail page for a specific session.
exports.session_detail = function(req, res, next) {
	if (req.user.user_group === "admin") {
		Session.find({}, "user views")
			.populate("user")
			.populate("views.item")
			.exec(function(err, session_list) {
				res.send(session_list);
			});
	}
};
