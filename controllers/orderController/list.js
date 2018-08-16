"use strict";

const Order = require("../../models/order");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    Order.find({}, "user total created_at")
      .populate("user")
      .exec(function(err, order_list) {
        if (err) return next(err);

        res.render("order/list", {
          title: "Order List",
          order_list: order_list
        });
      });
  }
};