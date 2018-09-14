"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      min: 6,
      max: 24,
      lowercase: true
    },
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true, max: 320 },
    names: {
      first_name: { type: String, required: true, max: 24 },
      middle_name: { type: String, max: 24, default: "" },
      last_name: { type: String, required: true, max: 24 }
    },
    addresses: [
      {
        street_address: { type: String, required: true, max: 48 },
        city: { type: String, required: true, max: 24 },
        state: { type: String, required: true, max: 2 },
        zip_code: { type: Number, required: true, min: 5, max: 5 }
      }
    ],
    current_cart: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        quantity: { type: Number, required: true, min: 1, default: 1 }
      }
    ],
    active_coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon"
      }
    ],
    // used_coupons: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Coupon"
    //   }
    // ],
    user_group: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user"
    },
    active: { type: Boolean, required: true, default: true }
  });

module.exports = UserSchema;
