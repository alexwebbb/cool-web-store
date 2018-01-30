"use strict";

const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	mongoose = require("mongoose"),
	keys = require("../config/keys"),
	User = require("../models/user");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new LocalStrategy(function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			if (!user.verifyPassword(password)) {
				return done(null, false);
			}
			return done(null, user);
		});
	})
);
