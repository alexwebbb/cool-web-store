"use strict";

const User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.active_coupons = [];
    await user.save();
    
    res.redirect("/store/cart/");
  } catch (err) {
    return next(err);
  }
};
