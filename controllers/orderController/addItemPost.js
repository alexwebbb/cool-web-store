"use strict";

const Item = require("../../models/item"),
  User = require("../../models/user"),
  async = require("async");

module.exports = function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        Item.findById(req.params.id).exec(function(err, item) {
          if (err) return next(err);
          if (item === null) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
          }
          callback(null, item._id);
        });
      },
      function(id, callback) {
        User.findById(req.user._id).exec(function(err, user) {
          user.add_to_cart(id);
          user.save().then(function(res) {
            callback(null);
          });
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/store/cart");
    }
  );

  // this is called from each item page as a button
  // adds an item to the user object cart
};