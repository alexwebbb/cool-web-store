"use strict";

const Item = require("../../models/item"),
  User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).exec();
    if (item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }

    const user = await User.findById(req.user._id).exec();
    user.add_to_cart(item.id);
    user.save();

    res.redirect("/store/cart");
  } catch (err) {
    return next(err);
  }
};
