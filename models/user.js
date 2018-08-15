"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  Session = require("../models/session"),
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
        ref: "Coupon",
        required: true
      }
    ],
    used_coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        required: true
      }
    ],
    current_session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      default: null
    },
    user_group: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user"
    },
    active: { type: Boolean, required: true, default: true }
  });

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

UserSchema.virtual("current_view")
  .get(function() {
    if (this.current_session) {
      return this.current_session[this.current_session.length - 1];
    }
  })
  .set(function(v) {
    console.log(this.current_session);
    const that = this;
    if (mongoose.Types.ObjectId.isValid(v)) {
      if (this.current_session) {
        Session.findById(this.current_session, "user views").exec(function(
          err,
          session
        ) {
          console.log(session);
          if (session === null) {
            that.current_session = null;
            that.save();
          }

          //   if (
          // 	moment(session[session.length - 1].time)
          // 	  .add(1, "minutes")
          // 	  .isBefore(Date.now())
          //   ) {
          //   //   // timeout, save session and start new one
          //   //   const session = new Session({
          //   //     user: this._id,
          //   //     views: this.current_session
          //   //   });

          //   //   session.save().then(function(res) {
          //   //     console.log(res._id);
          //   // 	this.current_session = res._id;
          //   //   });
          //   } else {
          //   //   // set new current view
          //   //   Session.findById(this.current_session, "views date_created").exec(function(
          //   //     err,
          //   //     session_list
          //   //   ) {
          //   //     //   console.log(session_list[session_list.length - 1]);
          //   //     session_list[session_list.length - 1].views.push({ item: v });
          //   //     session_list.save();
          //   //   });
          //   }
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

UserSchema.methods.add_to_cart = function(id) {
  if (!this.current_cart.some(e => e.item.equals(id))) {
    this.current_cart.push({ item: id });
  } else {
    this.current_cart.find(e => {
      return e.item.equals(id);
    }).quantity++;
  }
};

UserSchema.methods.activate_coupon = function(id) {
  if (!this.active_coupons.some(e => e.equals(id))) {
    this.active_coupons.push(id);
  }
};

module.exports = mongoose.model("User", UserSchema);
