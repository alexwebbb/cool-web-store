"use strict";

const UserSchema = require("./schema");

UserSchema.methods.add_to_cart = function(id) {
  if (!this.current_cart.some(e => e.item.equals(id))) {
    this.current_cart.push({ item: id });
  } else {
    this.current_cart.find(e => {
      return e.item.equals(id);
    }).quantity++;
  }
};