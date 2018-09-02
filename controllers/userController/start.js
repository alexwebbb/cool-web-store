"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  { rootCredentials: root } = require("../../config/keys");

module.exports = async function(req, res, next) {
  try {
    const users = await User.findOne({}).exec();
    if (users) {
      res.redirect("/");
    } else {
      salt(root.password).hash(async (err, hash) => {
        const user = new User({
          username: root.user,
          hashedPassword: hash,
          email: "admin@null.com",
          names: {
            first_name: "admin",
            last_name: "account"
          },
          user_group: "admin"
        });
        await user.save();
        res.redirect("/login");
      });
    }
  } catch (err) {
    return next(err);
  }
};
