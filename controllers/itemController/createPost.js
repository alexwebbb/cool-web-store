"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group").default,
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req),
        // Create an item object with escaped and trimmed data.
        item = new Item({
          name: req.body.item_name,
          description: req.body.description,
          price: req.body.price,
          img_100: req.body.img_100,
          img_700_400: req.body.img_700_400,
          item_groups: req.body.item_groups
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // retrieve all item groups for use in the form

        const item_group_list = await Item_group.find().exec();

        // Mark our selected item groups as checked.
        for (let i = 0; i < item_group_list.length; i++) {
          if (item.item_groups.indexOf(item_group_list[i]._id) > -1) {
            item_group_list[i].checked = "true";
          }
        }

        res.render("item/form", {
          title: "Create Item",
          item_groups: item_group_list,
          item: req.body,
          errors: errors.array()
        });
      } else {
        // Data from form is valid. Save the record
        await item.save();
        // Successful - redirect to new item record.
        res.redirect(item.url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
