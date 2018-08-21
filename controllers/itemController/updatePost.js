"use strict";

const Item = require("../../models/item"),
  Item_group = require("../../models/item_group"),
  { validationResult } = require("express-validator/check"),
  ValidateAndSanitizeFields = require("./ValidateAndSanitize");

module.exports = [
  ...ValidateAndSanitizeFields,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const item = await Item.findById(req.params.id)
            .populate("item_groups")
            .exec(),
          groups = await Item_group.find();

        // Mark our selected item groups as checked.
        for (let i = 0; i < groups.length; i++) {
          if (item.item_groups.indexOf(groups[i]._id) > -1) {
            groups[i].checked = "true";
          }
        }

        res.render("item/form", {
          title: "Update Item",
          item_groups: groups,
          item: item,
          errors: errors.array()
        });
      } else {
        const item = new Item({
            name: req.body.item_name,
            description: req.body.description,
            price: req.body.price,
            img_100: req.body.img_100,
            img_700_400: req.body.img_700_400,
            item_groups: req.body.item_groups,
            _id: req.body.id
          }),
          { url } = Item.findByIdAndUpdate(req.params.id, item, {});

        res.redirect(url);
      }
    } catch (err) {
      return next(err);
    }
  }
];
