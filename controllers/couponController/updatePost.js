"use strict";

const Coupon = require("../../models/coupon"),
  Item_group = require("../../models/item_group"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const coupon = await Coupon.findById(req.params.id)
            .populate("item_groups")
            .exec(),
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
      } else {
        const coupon = new Coupon({
            name: req.body.coupon_name,
            description: req.body.description,
            discount_percent: req.body.discount_percent,
            expirationDate: req.body.expirationDate,
            img_100: req.body.img_100,
            valid_item_groups: req.body.item_groups,
            _id: req.body.id
          }),
          { url } = await Coupon.findByIdAndUpdate(req.params.id, coupon, {});

        res.redirect(url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
