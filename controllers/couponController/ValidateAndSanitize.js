"use strict";

const Coupon = require("../../models/coupon"),
  { body } = require("express-validator/check"),
  { sanitizeBody } = require("express-validator/filter"),
  ValidateAndSanitizeFields = [
    // Validate fields.
    body("coupon_name")
      .exists()
      .withMessage("Coupon name must be specified.")
      .isLength({ min: 6, max: 24 })
      .withMessage("Coupon name must be between 6 and 24 characters.")
      .isAscii()
      .withMessage("Coupon name has non-standard characters.")
      .custom(function(value, { req }) {
        // uniqueness validation
        return new Promise((resolve, reject) => {
          Coupon.findOne({ name: value }).exec(function(err, existing_coupon) {
            if (existing_coupon && !existing_coupon._id.equals(req.body.id)) {
              reject("Coupon name is not unique.");
            } else {
              resolve(value);
            }
          });
        });
      }),
    body("description")
      .optional({ checkFalsy: true })
      .isLength({ max: 480 })
      .withMessage("description is too long.")
      .isAscii()
      .withMessage("description has non-standard characters."),
    body("discount_percent")
      .exists()
      .withMessage("discount percent field is empty")
      .isFloat({ min: 0, max: 100 })
      .withMessage("discount percent is out of range"),
    body("img_100")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage(
        "A reference to an image needs to be a url. A CDN would be ideal!"
      ),

    // Sanitize fields.
    sanitizeBody("coupon_name")
      .trim()
      .escape(),
    sanitizeBody("description")
      .trim()
      .escape(),
    sanitizeBody("discount_percent")
      .trim()
      .escape(),
    sanitizeBody("img_100").trim()
  ];

module.exports = ValidateAndSanitizeFields;
