const Item = require("../models/item"),
	Item_group = require("../models/item_group"),
	User = require("../models/user"),
	Order = require("../models/order"),
	Session = require("../models/session"),
	async = require("async");

exports.index = function(req, res, next) {
	res.redirect("/store");
};
