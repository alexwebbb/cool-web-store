"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("user/form", {
        title: "Create User",
        user: req.body,
        errors: errors.array()
      });
    } else {
      try {
        const hash = await salt(req.body.password).hash(),
          user = new User({
            username: req.body.username,
            hashedPassword: hash,
            email: req.body.email,
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            user_group: req.body.admin ? "admin" : "user"
          }),
          { url } = await user.save();
        res.redirect(url);
      } catch (err) {
        return next(err);
      }
    }
  }
];
