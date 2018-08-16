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
        // Data from form is valid.
        // Check if group with same name already exists.
        Item_group.findOne({ name: req.body.name }).exec(function(
          err,
          found_group
        ) {
          if (err) {
            return next(err);
          }

          if (found_group) {
            // group exists, redirect to its detail page.
            res.redirect(found_group.url);
          } else {
            group.save(function(err) {
              if (err) {
                return next(err);
              }
              // group saved. Redirect to group detail page.
              res.redirect(group.url);
            });
          }
        });
      }
    } else {
      res.redirect("/store/groups");
    }
  }
];