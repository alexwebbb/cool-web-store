"use strict";

const Coupon = require("../../models/coupon"),
  Item_group = require("../../models/item_group"),
  async = require("async"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  (req, res, next) => {
    if (req.user.user_group === "admin") {
      // Extract the validation errors from a request.
      const errors = validationResult(req),
        // Create an coupon object with escaped and trimmed data.
        coupon = new Coupon({
          name: req.body.coupon_name,
          description: req.body.description,
          discount_percent: req.body.discount_percent,
          expirationDate: req.body.expirationDate,
          img_100: req.body.img_100,
          valid_item_groups: req.body.item_groups,
          _id: req.body.id
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.

        // retrieve existing data since form data was invalid
        async.parallel(
          {
            coupon: function(callback) {
              Coupon.findById(req.params.id)
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

            // Mark our selected coupon groups as checked.
            for (let i = 0; i < results.groups.length; i++) {
              if (coupon.item_groups.indexOf(results.groups[i]._id) > -1) {
                results.groups[i].checked = "true";
              }
            }

            res.render("coupon/form", {
              title: "Update Coupon",
              item_groups: results.groups,
              coupon: results.coupon,
              errors: errors.array()
            });
          }
        );

        return;
      } else {
        // Data from form is valid. Update the record.
        Coupon.findByIdAndUpdate(req.params.id, coupon, {}, function(
          err,
          _coupon
        ) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(_coupon.url);
        });
      }
    } else {
      res.redirect("/store/coupons");
    }
  }
];
