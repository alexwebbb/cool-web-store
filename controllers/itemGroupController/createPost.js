"use strict";

const Item_group = require("../../models/item_group"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req),
      // Create a group object with escaped and trimmed data.
      group = new Item_group({
        name: req.body.group_name,
        description: req.body.description,
        img_100: req.body.img_100
      });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("group/form", {
        title: "Create Group",
        group: group,
        errors: errors.array()
      });
      return;
    } else {
      try {
        // Data from form is valid.
        // Check if group with same name already exists.
        const found_group = await Item_group.findOne({
          name: req.body.name
        }).exec();

        if (found_group) {
          // group exists, redirect to its detail page.
          res.redirect(found_group.url);
        } else {
          await group.save();
          // group saved. Redirect to group detail page.
          res.redirect(group.url);
        }
      } catch (err) {
        return next(err);
      }
    }
  }
];
