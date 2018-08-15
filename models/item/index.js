"use strict";

const mongoose = require("mongoose"),
	ItemSchema = require("./schema");

require("./price");

require("./url");

require("./formattedGroups");

require("./formattedPrice");

module.exports = mongoose.model("Item", ItemSchema);
