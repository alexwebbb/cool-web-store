"use strict";

const Item = require("../../models/item"),
  User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    const item = await Item.findById(req.params.id)
      .populate("item_groups")
      .exec();
    if (item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    if (req.user) {
      const user = await User.findById(req.user._id).exec();
      user.current_view = req.params.id;
    }
    res.render("item/detail", {
      title: "Item Detail",
      item: item
    });
  } catch (err) {
    return next(err);
  }
};
