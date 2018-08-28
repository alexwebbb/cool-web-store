"use strict";

const ItemSchema = require("./schema"),
  Monetize = require("./../../utils/Monetize");

ItemSchema.virtual("formattedPrice").get(function() {
  return Monetize(this.price_history[0].price);
});
