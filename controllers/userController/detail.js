"use strict";

const User = require("../../models/user"),
  Order = require("../../models/order"),
  async = require("async");

module.exports = function(req, res, next) {
  if (req.user._id.equals(req.params.id) || req.user.user_group === "admin") {
    async.parallel(
      {
        user: function(callback) {
          User.findById(req.params.id).exec(callback);
        },
        orders: function(callback) {
          Order.find({ user: req.params.id }, "total created_at").exec(
            callback
          );
        }
      },
      function(err, results) {
        if (err) return next(err);
        if (results.user == null) {
          // No results.
          const err = new Error("user not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render
        res.render("user/detail", {
          title: "User Detail",
          user_detail: results.user,
          order_list: results.orders
        });
      }
    );
  } else {
    res.redirect("/login");
  }
};