"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  { rootCredentials: root } = require("../../config/keys");

module.exports = function(req, res, next) {
  User.findOne({}).exec(function(err, users) {
    if (users) {
      res.redirect("/");
    } else {
      salt(root.password).hash(function(err, hash) {
        // Create a user object with escaped and trimmed data.
        const user = new User({
          username: root.user,
          hashedPassword: hash,
          email: "admin@null.com",
          names: {
            first_name: "admin",
            last_name: "account"
          },
          user_group: "admin"
        });

        user.save(function(err) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to login screen
          res.redirect("/login");
        });
      });
    }
  });
};