"use strict";

const Item = require("../../models/item"),
  Order = require("../../models/order"),
  async = require("async");

module.exports = function(req, res, next) {
  if (req.user.user_group === "admin") {
    async.parallel(
      {
        item: function(callback) {
          Item.findById(req.params.id).exec(callback);
        },
        orders: function(callback) {
          Order.findOne({ "cart.item": req.params.id }).exec(callback);
        }
      },
      function(err, results) {
        if (err) return next(err);
        if (results.item === null) {
          const err = new Error("Item not found");
          err.status = 404;
          return next(err);
        }
        res.render("item/delete", {
          title: "Item Delete",
          orders: results.orders,
          item: results.item
        });
      }
    );
  } else {
    res.redirect("/store/items");
  }
};