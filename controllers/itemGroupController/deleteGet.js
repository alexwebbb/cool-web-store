"use strict";

const Item_group = require("../../models/item_group");

module.exports = async function(req, res, next) {
  try {
    const group = await Item_group.findById(req.params.id).exec();
    if (results.item === null) {
      const err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
    res.render("group/delete", {
      title: "Group Delete",
      group: group
    });
  } catch (err) {
    return next(err);
  }
};
