"use strict";

const passport = require("passport"),
	{ ensureLoggedIn } = require("connect-ensure-login");

module.exports = app => {
	app.get("/login", function(req, res) {
		res.render("login");
	});

	app.post(
		"/login",
		passport.authenticate("local", { failureRedirect: "/login" }),
		function(req, res) {
			res.redirect("/");
		}
	);

	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	app.get(
		"/profile",
		ensureLoggedIn(),
		function(req, res) {
			res.render("profile", { user: req.user });
		}
	);
};
