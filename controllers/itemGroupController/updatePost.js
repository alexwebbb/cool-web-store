"use strict";

const Item_group = require("../../models/item_group"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const group = await Item_group.findById(req.params.id).exec();

        res.render("group/form", {
          title: "Create Group",
          group: group,
          errors: errors.array()
        });
      } else {
        const group = new Item_group({
            name: req.body.group_name,
            description: req.body.description,
            img_100: req.body.img_100,
            _id: req.body.id
          }),
          { url } = await Item_group.findByIdAndUpdate(
            req.params.id,
            group,
            {}
          );

        res.redirect(url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
