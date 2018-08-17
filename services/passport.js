"use strict";

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  salt = require("password-hash-and-salt"),
  User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    // retrieve the user object
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      // if no result, return
      if (!user) {
        return done(null, false);
      }

      // check the submitted password against the hash
      salt(password).verifyAgainst(user.hashedPassword, function(
        error,
        verified
      ) {
        if (error) throw new Error("Something went wrong in the decryption");
        if (!verified) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  })
);
