"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group"),
  async = require("async"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  (req, res, next) => {
    if (req.user.user_group === "admin") {
      console.log(req.body);
      // Extract the validation errors from a request.
      const errors = validationResult(req),
        // Create an item object with escaped and trimmed data.
        item = new Item({
          name: req.body.item_name,
          description: req.body.description,
          price: req.body.price,
          img_100: req.body.img_100,
          img_700_400: req.body.img_700_400,
          item_groups: req.body.item_groups,
          _id: req.body.id
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.

        // retrieve existing data since form data was invalid
        async.parallel(
          {
            item: function(callback) {
              Item.findById(req.params.id)
                .populate("item_groups")
                .exec(callback);
            },
            groups: function(callback) {
              Item_group.find(callback);
            }
          },
          function(err, results) {
            if (err) {
              return next(err);
            }

            // Mark our selected item groups as checked.
            for (let i = 0; i < results.groups.length; i++) {
              if (item.item_groups.indexOf(results.groups[i]._id) > -1) {
                results.groups[i].checked = "true";
              }
            }

            res.render("item/form", {
              title: "Update Item",
              item_groups: results.groups,
              item: results.item,
              errors: errors.array()
            });
          }
        );

        return;
      } else {
        // Data from form is valid. Update the record.
        Item.findByIdAndUpdate(req.params.id, item, {}, function(err, _item) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(_item.url);
        });
      }
    } else {
      res.redirect("/store/items");
    }
  }
];