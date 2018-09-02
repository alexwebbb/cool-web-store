"use strict";

const mongoose = require("mongoose"),
  moment = require("moment"),
  Session = require("../../models/session"),
  UserSchema = require("./schema"),
  resetSession = async (user, view) => {
    const session = new Session({
        user: user._id,
        views: [{ item: view }]
      }),
      res = await session.save();
    user.current_session = res._id;
    await user.save();
  };

UserSchema.virtual("current_view")
  .get(function() {
    if (this.current_session) {
      return this.current_session[this.current_session.length - 1];
    }
  })
  .set(async function(v) {
    if (mongoose.Types.ObjectId.isValid(v)) {
      if (this.current_session) {
        const existing_session = await Session.findById(
          this.current_session,
          "user views"
        ).exec();

        if (
          existing_session === null ||
          moment(existing_session.views[existing_session.views.length - 1].time)
            .add(15, "minutes")
            .isBefore(moment(Date.now()))
        ) {
          resetSession(this, v);
        } else {
          existing_session.views.push({
            item: v
          });
          existing_session.save();
        }
      } else {
        resetSession(this, v);
      }
    } else {
      return new Error(
        "Invalid item id. Something is wrong with the call of this function"
      );
    }
  });
