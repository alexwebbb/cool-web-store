"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  CouponSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    discount_percent: { type: Number, required: true, min: 0, max: 100 },
    valid_range: {
      begin: { type: Date, required: true, default: Date.now() },
      end: { type: Date, default: null }
    },
    valid_item_groups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "ItemGroup"
        }
      ],
      required: true
    },
    code: { type: String, required: true, min: 4, max: 12 }
  });

module.exports = CouponSchema;
