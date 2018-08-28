"use strict";

const Item_group = require("../../models/item_group").default;

module.exports = async function(req, res, next) {
  try {
    const group = await Item_group.findById(req.params.id).exec();
    if (group == null) {
      const err = new Error("item not found");
      err.status = 404;
      return next(err);
    }

    res.render("group/form", {
      title: "Update group",
      group: group
    });
  } catch (err) {
    return next(err);
  }
};
