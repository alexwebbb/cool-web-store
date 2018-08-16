"use strict";

const Item_group = require("../../models/item_group"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  (req, res, next) => {
    if (req.user.user_group === "admin") {
      // Extract the validation errors from a request.
      const errors = validationResult(req),
        // Create a group object with escaped and trimmed data.
        group = new Item_group({
          name: req.body.group_name,
          description: req.body.description,
          img_100: req.body.img_100,
          _id: req.body.id
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.

        // retrieve existing data since form data was invalid
        Item_group.findById(req.params.id).exec(function(err, group) {
          if (err) {
            return next(err);
          }

          res.render("group/form", {
            title: "Create Group",
            group: group,
            errors: errors.array()
          });
        });

        return;
      } else {
        // Data from form is valid. Update the record.
        Item_group.findByIdAndUpdate(req.params.id, group, {}, function(
          err,
          _group
        ) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(_group.url);
        });
      }
    } else {
      res.redirect("/store/groups");
    }
  }
];
