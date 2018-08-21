"use strict";

const User = require("../../models/user"),
  Order = require("../../models/order");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id).exec(),
      orders = await Order.find(
        { user: req.params.id },
        "total created_at"
      ).exec();
      
    if (user == null) {
      const err = new Error("user not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render("user/detail", {
      title: "User Detail",
      user_detail: user,
      order_list: orders
    });
  } catch (err) {
    return next(err);
  }
};
