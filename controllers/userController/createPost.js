"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

// Display user create form on post.
module.exports = [
  // Validate fields.
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    errors.array().push({ msg: "testing 123" });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("user/form", {
        title: "Create User",
        user: req.body,
        errors: errors.array()
      });
      return;
    } else {
      salt(req.body.password).hash(function(err, hash) {
        // Create a user object with escaped and trimmed data.
        const user = new User({
          username: req.body.username,
          hashedPassword: hash,
          email: req.body.email,
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          user_group: req.body.admin ? "admin" : "user"
        });

        user.save(function(err) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to new user record.
          res.redirect(user.url);
        });
      });
    }
  }
];