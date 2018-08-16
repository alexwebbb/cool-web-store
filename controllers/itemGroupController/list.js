"use strict";

const Item_group = require("../../models/item_group");

module.exports = function(req, res, next) {
  Item_group.find({}, "name description img_100").exec(function(
    err,
    group_list
  ) {
    if (err) return next(err);

    res.render("group/list", {
      title: "Group List",
      group_list: group_list
    });
  });
};
