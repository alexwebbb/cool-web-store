"use strict";

const mongoose = require("mongoose"),
	CouponSchema = require("./schema");

require("./url");

require("./beginDateFormatted");

require("./expirationDate");

module.exports = mongoose.model("Coupon", CouponSchema);
