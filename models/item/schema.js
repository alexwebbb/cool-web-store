"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ValidPrice = require("./ValidPrice"),
  ItemSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price_history: {
      type: [
        {
          price: {
            type: Number,
            validate: {
              validator: function(v) {
                return ValidPrice.test(v);
              },
              message: "{VALUE} is not a valid price!"
            },
            required: true
          },
          date: { type: Date, required: true, default: Date.now() }
        }
      ],
      required: true
    },
    availability: { type: Number, required: true, min: -1, default: 0 },
    active: { type: Boolean, required: true, default: true },
    item_groups: [{ type: Schema.Types.ObjectId, ref: "ItemGroup" }],
    img_100: {
      type: String,
      required: true,
      default: "https://placehold.it/100x100"
    },
    img_700_400: {
      type: String,
      required: true,
      default: "https://placehold.it/700x400"
    }
  });

module.exports = ItemSchema;
