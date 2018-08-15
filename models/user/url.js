"use strict";

const UserSchema = require("./schema");

UserSchema.virtual("url").get(function() {
  return "/user/" + this._id;
});