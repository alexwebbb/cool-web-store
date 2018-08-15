"use strict";

const UserSchema = require("./schema");

UserSchema.virtual("first_name")
  .get(function(v) {
    return this.names.first_name;
  })
  .set(function(v) {
    this.names.first_name = v;
  });
UserSchema.virtual("middle_name")
  .get(function(v) {
    return this.names.middle_name;
  })
  .set(function(v) {
    this.names.middle_name = v;
  });
UserSchema.virtual("last_name")
  .get(function(v) {
    return this.names.last_name;
  })
  .set(function(v) {
    this.names.last_name = v;
  });

UserSchema.virtual("name").get(function() {
  const { first_name, middle_name, last_name } = this.names;
  return `${first_name} ${middle_name} ${last_name}`;
});