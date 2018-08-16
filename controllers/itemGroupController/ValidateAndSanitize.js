"use strict";

const Item_group = require("../../models/item_group"),
  { body } = require("express-validator/check"),
  { sanitizeBody } = require("express-validator/filter"),
  ValidateAndSanitizeFields = [
    // Validate fields.
    body("group_name")
      .exists()
      .withMessage("group name must be specified.")
      .isLength({ min: 3, max: 24 })
      .withMessage("group name must be between 6 and 24 characters.")
      .isAscii()
      .withMessage("group name has non-standard characters.")
      .custom(function(value, { req }) {
        // uniqueness validation
        return new Promise((resolve, reject) => {
          Item_group.findOne({ name: value }).exec(function(
            err,
            existing_group
          ) {
            if (existing_group && !existing_group._id.equals(req.body.id)) {
              reject("Group name is not unique.");
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
    body("img_100")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage(
        "A reference to an image needs to be a url. A CDN would be ideal!"
      ),
    // Sanitize fields.
    sanitizeBody("group_name")
      .trim()
      .escape(),
    sanitizeBody("description")
      .trim()
      .escape(),
    sanitizeBody("img_100").trim()
  ];

  module.exports = ValidateAndSanitizeFields;
