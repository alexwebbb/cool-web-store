"use strict";

const User = require("../../models/user");

module.exports = async function(req, res, next) {
  try {
    const user_list = await User.find().exec();
    //Successful, so render
    res.render("user/list", {
      title: "User List",
      user_list: user_list
    });
  } catch (err) {
    return next(err);
  }
};
