"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  SessionSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      views: [
        {
          item: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: true
          },
          time: { type: Date, required: true, default: Date.now() }
        }
      ]
    },
    { timestamps: true }
  );

module.exports = mongoose.model("Session", SessionSchema);
