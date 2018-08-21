"use strict";

const User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id).exec();
    if (user == null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.render("user/form", {
      title: "Update user",
      user: user
    });
  } catch (err) {
    return next(err);
  }
};
