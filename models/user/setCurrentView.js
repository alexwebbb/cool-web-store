"use strict";

const mongoose = require("mongoose"),
  moment = require("moment"),
  Session = require("../session"),
  UserSchema = require("./schema"),
  resetSession = async (user, view) => {
    const session = new Session({
      user: user._id,
      views: [{ item: view }]
    });
    await session.save();
  };

UserSchema.methods.set_current_view = async function(view) {
  if (this && mongoose.Types.ObjectId.isValid(view)) {
    const [existing_session] = await Session.find(
      { user: this._id },
      "user views updatedAt"
    )
      .sort("-updatedAt")
      .exec();

    if (existing_session) {
      if (
        moment(existing_session.updatedAt)
          .add(15, "minutes")
          .isBefore(moment(Date.now()))
      ) {
        await resetSession(this, view);
      } else {
        existing_session.views.push({
          item: view
        });
        await existing_session.save();
      }
    } else {
      await resetSession(this, view);
    }
  } else {
    return new Error(
      "Invalid item id. Something is wrong with the call of this function"
    );
  }
};
