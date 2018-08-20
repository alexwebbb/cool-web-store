"use strict";

const Item_group = require("../../models/item_group");

module.exports = async function (req, res, next) {
  if (req.user.user_group === "admin") {
    try {
      // retrieve all item groups for use in the form
      await Item_group.find().exec();
      //Successful, so render
      res.render("item/form", {
        title: "Create Item",
        item_groups: item_group_list
      });
    } catch (err) {
      return next(err);
    }
  } else {
    res.redirect("/store/items");
  }
};
