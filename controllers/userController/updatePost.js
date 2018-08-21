"use strict";

const User = require("../../models/user"),
  salt = require("password-hash-and-salt"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  async (req, res, next) => {
    try {
      const hash = await salt(req.body.password).hash(),
        errors = validationResult(req);

      if (hash !== null) {
        user.hashedPassword = hash;
      }

      if (!errors.isEmpty()) {
        const user = User.findById(req.params.id).exec();

        res.render("user/form", {
          title: "Update Item",
          user: user,
          errors: errors.array()
        });
      } else {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            _id: req.body.id
          }),
          { url } = await User.findByIdAndUpdate(req.params.id, user, {});
        res.redirect(url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
