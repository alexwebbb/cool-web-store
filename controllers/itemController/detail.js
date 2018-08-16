"use strict";

const Item = require("../../models/item"),
  User = require("../../models/user");

module.exports = function(req, res, next) {
  Item.findById(req.params.id)
    .populate("item_groups")
    .exec(function(err, item) {
      if (err) return next(err);
      if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      if (req.user) {
        User.findById(req.user._id).exec(function(err, user) {
          user.current_view = req.params.id;
        });
      }

      res.render("item/detail", {
        title: "Item Detail",
        item: item
      });
    });
};
