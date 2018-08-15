"use strict";

const mongoose = require("mongoose"),
  moment = require("moment"),
  Session = require("../../models/session"),
  UserSchema = require("./schema");

UserSchema.virtual("current_view")
  .get(function() {
    if (this.current_session) {
      return this.current_session[this.current_session.length - 1];
    }
  })
  .set(function(v) {
    const that = this;
    if (mongoose.Types.ObjectId.isValid(v)) {
      if (this.current_session) {
        Session.findById(this.current_session, "user views").exec(function(
          err,
          existing_session
        ) {
          if (existing_session === null) {
            that.current_session = null;
            that.save();
            return;
          }
          if (
            moment(
              existing_session.views[existing_session.views.length - 1].time
            )
              .add(10, "minutes")
              .isBefore(moment(Date.now()))
          ) {
            // timeout, save session and start new one
            const session = new Session({
              user: that._id,
              views: [{ item: v }]
            });

            session.save().then(function(res) {
              that.current_session = res._id;
              that.save();
            });
          } else {
            existing_session.views.push({
              item: v
            });
            existing_session.save();
          }
        });
      } else {
        // set initial item
        const session = new Session({
          user: this._id,
          views: [{ item: v }]
        });

        session.save().then(function(res) {
          that.current_session = res._id;
          that.save();
        });
      }
    } else {
      return new Error(
        "Invalid item id. Something is wrong with the call of this function"
      );
    }
  });
