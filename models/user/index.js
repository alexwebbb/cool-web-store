"use strict";

const mongoose = require("mongoose"),
  UserSchema = require("./schema");

require("./url");

require("./address");

require("./name");

require("./currentView");

require("./addToCart");

require("./activateCoupon");

module.exports = mongoose.model("User", UserSchema);
