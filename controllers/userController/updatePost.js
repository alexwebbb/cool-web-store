"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  (req, res, next) => {
    if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
      const hash = new Promise(resolve => {
          if (req.body.password) {
            salt(req.body.password).hash(function(err, hash) {
              resolve(hash);
            });
          } else {
            resolve(null);
          }
        }),
        errors = validationResult(req),
        user = new User({
          username: req.body.username,
          email: req.body.email,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          _id: req.body.id
        });

      if (hash !== null) {
        user.hashedPassword = hash;
      }

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.

        // retrieve existing data since form data was invalid
        User.findById(req.params.id).exec(function(err, user) {
          if (err) {
            return next(err);
          }

          res.render("user/form", {
            title: "Update Item",
            user: user,
            errors: errors.array()
          });
        });

        return;
      } else {
        // Data from form is valid. Update the record.
        User.findByIdAndUpdate(req.params.id, user, {}, function(err, _user) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(_user.url);
        });
      }
    } else {
      res.redirect("/login");
    }
  }
];