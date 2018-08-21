"use strict";

const express = require("express"),
	mongoose = require("mongoose"),
	path = require("path"),
	favicon = require("serve-favicon"),
	logger = require("morgan"),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	helmet = require("helmet"),
	cookieSession = require("cookie-session"),
	passport = require("passport"),
	keys = require("./config/keys"),
	{ authRoutes, coupons, groups, items, orders, root, sessions, users } = require("./routes"),
	app = express();

app.use(helmet());

// initialize mongoose
mongoose.connect(keys.mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set up passport authentication

require("./services/passport");

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

// always make the user object available in the pug templates
app.use((req, res, next) => {
	res.locals.current_user = req.user;
	next();
});

// Declare routes as middleware
app.use("/", root);
app.use("/", users);
app.use("/store", items);
app.use("/store", groups);
app.use("/store", coupons);
app.use("/store", sessions);
app.use("/store", orders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
