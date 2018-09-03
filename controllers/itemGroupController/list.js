"use strict";

const Item_group = require("../../models/item_group");

module.exports = async function(req, res, next) {
  try {
    const group_list = await Item_group.find({}, "name description img_100").exec();
  
      res.render("group/list", {
        title: "Group List",
        group_list: group_list
      });
  } catch (err) {
    return next(err);
  }
};
