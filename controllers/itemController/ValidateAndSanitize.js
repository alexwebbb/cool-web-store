"use strict";

const Item = require("../../models/item"),
  { body } = require("express-validator/check"),
  { sanitizeBody } = require("express-validator/filter"),
  ValidateAndSanitizeFields = [
    // Validate fields.
    body("item_name")
      .exists()
      .withMessage("Item name must be specified.")
      .isLength({ min: 3, max: 24 })
      .withMessage("Item name must be between 6 and 24 characters.")
      .isAscii()
      .withMessage("Item name has non-standard characters.")
      .custom(function(value, { req }) {
        // uniqueness validation
        return new Promise((resolve, reject) => {
          Item.findOne({ name: value }).exec(function(err, existing_item) {
            if (existing_item && !existing_item._id.equals(req.body.id)) {
              reject("Item name is not unique.");
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
    body("price")
      .optional({ checkFalsy: true })
      .isLength({ max: 124 })
      .withMessage("price is too long.")
      .isCurrency({ digits_after_decimal: [1, 2] })
      .withMessage("price has non-numeric characters."),
    body("img_100")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage(
        "A reference to an image needs to be a url. A CDN would be ideal!"
      ),
    body("img_700_400")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage(
        "A reference to an image needs to be a url. A CDN would be ideal!"
      ),

    // Sanitize fields.
    sanitizeBody("item_name")
      .trim()
      .escape(),
    sanitizeBody("description")
      .trim()
      .escape(),
    sanitizeBody("price")
      .trim()
      .escape(),
    sanitizeBody("img_100").trim(),
    sanitizeBody("img_700_400").trim()
  ];

module.exports = ValidateAndSanitizeFields;
