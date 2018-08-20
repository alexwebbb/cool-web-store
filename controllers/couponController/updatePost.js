"use strict";

const Coupon = require("../../models/coupon"),
  Item_group = require("../../models/item_group"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  async (req, res, next) => {
    if (req.user.user_group === "admin") {
      try {
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
          const coupon = await Coupon.findById(req.params.id)
            .populate("item_groups").exec(),
            groups = await Item_group.find(callback);

          // Mark our selected coupon groups as checked.
          for (let i = 0; i < groups.length; i++) {
            if (coupon.item_groups.indexOf(groups[i]._id) > -1) {
              groups[i].checked = "true";
            }
          }

          res.render("coupon/form", {
            title: "Update Coupon",
            item_groups: groups,
            coupon: coupon,
            errors: errors.array()
          });

          return;
        } else {
          // Data from form is valid. Update the record.
          const { url } = await Coupon.findByIdAndUpdate(req.params.id);
          // Successful - redirect to book detail page.
          res.redirect(url);
        }
      } catch (err) {
        return next(err);
      }
    } else {
      res.redirect("/store/coupons");
    }
  }
];
