"use strict";

const User = require("../../models/user"),
  { body } = require("express-validator/check"),
  { sanitizeBody } = require("express-validator/filter"),
  ValidateAndSanitizeFields = [
    // Validate fields.
    body("username")
      .exists()
      .withMessage("Username must be specified.")
      .isLength({ min: 6, max: 24 })
      .withMessage("Username must be between 6 and 24 characters.")
      .isAlphanumeric()
      .withMessage("Username has non-alphanumeric characters.")
      .custom(function(value, { req }) {
        // uniqueness validation
        return new Promise((resolve, reject) => {
          User.findOne({ username: value.toLowerCase() }).exec(function(
            err,
            existing_user
          ) {
            if (existing_user && !existing_user._id.equals(req.body.id)) {
              reject("Username is not unique.");
            } else {
              resolve(value);
            }
          });
        });
      }),
    body("password")
      .optional({ checkFalsy: true })
      .isLength({ min: 7, max: 256 })
      .withMessage("Password must be between 7 and 256 characters.")
      .custom(function(value, { req }) {
        if (value === req.body.password_confirm) {
          return value;
        } else {
          throw new Error("Passwords do not match");
        }
      }),
    body("email")
      .exists()
      .withMessage("Email must be specified.")
      .isEmail()
      .withMessage("Email is in an invalid format."),
    body("first_name")
      .exists()
      .withMessage("First name must be specified.")
      .isLength({ max: 24 })
      .withMessage("First name is too long.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters."),
    body("middle_name")
      .optional({ checkFalsy: true })
      .isLength({ max: 24 })
      .withMessage("Middle name is too long.")
      .isAlphanumeric()
      .withMessage("Middle name has non-alphanumeric characters."),
    body("last_name")
      .exists()
      .withMessage("Last name must be specified.")
      .isLength({ max: 24 })
      .withMessage("Last name is too long.")
      .isAlphanumeric()
      .withMessage("Last name has non-alphanumeric characters."),

    // Sanitize fields.
    sanitizeBody("username")
      .trim()
      .escape(),
    sanitizeBody("password")
      .trim()
      .escape(),
    sanitizeBody("email")
      .trim()
      .escape()
      .normalizeEmail(),
    sanitizeBody("first_name")
      .trim()
      .escape(),
    sanitizeBody("middle_name")
      .trim()
      .escape(),
    sanitizeBody("last_name")
      .trim()
      .escape()
  ];

  module.exports = ValidateAndSanitizeFields;