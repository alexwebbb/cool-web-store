"use strict";

const Coupon = require("../../models/coupon"),
  Item_group = require("../../models/item_group");

module.exports = async function(req, res, next) {
  // Get coupons and groups for form.
  try {
    const coupon = await Coupon.findById(req.params.id)
        .populate("valid_item_groups")
        .exec(),
      groups = await Item_group.find();

    if (coupon == null) {
      const err = new Error("coupon not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    // Mark our selected groups as checked.
    for (let all_g_iter = 0; all_g_iter < groups.length; all_g_iter++) {
      for (
        let coupon_g_iter = 0;
        coupon_g_iter < coupon.valid_item_groups.length;
        coupon_g_iter++
      ) {
        if (
          groups[all_g_iter]._id.toString() ==
          coupon.valid_item_groups[coupon_g_iter]._id.toString()
        ) {
          groups[all_g_iter].checked = "true";
        }
      }
    }
    res.render("coupon/form", {
      title: "Update coupon",
      item_groups: groups,
      coupon: coupon
    });
  } catch (err) {
    return next(err);
  }
};
