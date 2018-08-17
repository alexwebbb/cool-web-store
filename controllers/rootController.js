exports.root = function(req, res, next) {
	res.redirect("/store");
};

exports.about = function(req, res, next) {
	res.render("about");
};

