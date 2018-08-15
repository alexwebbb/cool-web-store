"use strict";

const moment = require("moment"),
  CouponSchema = require("./schema");

CouponSchema.virtual("expirationDate")
  .get(function() {
    if (this.valid_range.end) {
      return moment(this.valid_range.end).format("MMMM Do, YYYY");
    } else {
      return null;
    }
  })
  .set(function(value) {
    this.valid_range.end = value;
  });
