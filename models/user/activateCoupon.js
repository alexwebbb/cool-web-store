"use strict";

const UserSchema = require("./schema");

UserSchema.methods.activateCoupon = function(id) {
    if (!this.active_coupons.some(e => e.equals(id))) {
      this.active_coupons.push(id);
    }
  };