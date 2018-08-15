"use strict";

const moment = require("moment"),
  CouponSchema = require("./schema");

CouponSchema.virtual("beginDateFormatted").get(function() {
  return moment(this.valid_range.begin).format("MMMM Do, YYYY");
});
