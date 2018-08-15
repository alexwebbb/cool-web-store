"use strict";

const UserSchema = require("./schema");

UserSchema.virtual("url").get(function() {
  return "/user/" + this._id;
});

UserSchema.virtual("address")
  .get(function() {
    const { street_address, city, state, zip_code } = this.addresses[0];
    return `${street_address}, ${city} ${state} ${zip_code}`;
  })
  .set(function(v) {
    const { street_address, city, state, zip_code } = v;

    if (street_address && city && state && zipcode) {
      this.addresses.unshift({
        street_address: street_address,
        city: city,
        state: state,
        zip_code: zip_code
      });
    }
  });