"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  { item_group_schema } = require("./item_group"),
  OrderSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      cart: [
        {
          item: {
            name: { type: String, required: true },
            description: String,
            price: Number,
            item_groups: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
            img_100: String,
            img_700_400: String,
            _id: { type: String, required: true }
          },
          quantity: { type: Number, required: true, min: 1 }
        }
      ],
      total: { type: Number, required: true },
      coupons_present: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
      item_groups_present: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
      shipping_address: {
        street_address: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: Number }
      },
      status: {
        type: String,
        required: true,
        enum: ["New", "Pending", "Complete", "Canceled", "Returned"],
        default: "New"
      }
    },
    {
      timestamps: { createdAt: "created_at" }
    }
  );

OrderSchema.virtual("url").get(function() {
  return "/store/order/" + this._id;
});

module.exports = mongoose.model("Order", OrderSchema);
