"use strict";

const Item_group = require("../../models/item_group");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    // retrieve all coupon groups for use in the form
    Item_group.find().exec(function(err, item_group_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("coupon/form", {
        title: "Create Coupon",
        item_groups: item_group_list
      });
    });
  } else {
    res.redirect("/store/coupons");
  }
};
