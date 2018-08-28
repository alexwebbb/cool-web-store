"use strict";

const Coupon = require("../../models/coupon"),
  Item_group = require("../../models/item_group").default,
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  async (req, res, next) => {
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
          code: req.body.code,
          valid_item_groups: req.body.item_groups
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.

        // retrieve all coupon groups for use in the form
        const item_group_list = await Item_group.find().exec();

        // Mark our selected coupon groups as checked.
        for (let i = 0; i < item_group_list.length; i++) {
          if (coupon.item_groups.indexOf(item_group_list[i]._id) > -1) {
            item_group_list[i].checked = "true";
          }
        }

        res.render("coupon/form", {
          title: "Create Coupon",
          item_groups: item_group_list,
          coupon: req.body,
          errors: errors.array()
        });
      } else {
        // Data from form is valid. Save the record
        await coupon.save();
        // Successful - redirect to new coupon record.
        res.redirect(coupon.url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
