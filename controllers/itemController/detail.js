"use strict";

const Item = require("../../models/item"),
  User = require("../../models/user"),
  Shuffle = require("../../utils/FisherYatesShuffle");

module.exports = async function(req, res, next) {
  try {
    const item = await Item.findById(req.params.id)
      .populate("item_groups")
      .exec();
    if (item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    if (req.user) {
      const user = await User.findById(req.user._id).exec();
      await user.set_current_view(req.params.id);
    }

    let related_items = await Item.find({
      item_groups: { $in: item.item_groups }
    }).exec();
    related_items = related_items.filter(value => {
      return !value._id.equals(item._id);
    });
    related_items = Shuffle(related_items);
    related_items = related_items.slice(0, 3);

    res.render("item/detail", {
      title: "Item Detail",
      item,
      related_items
    });
  } catch (err) {
    return next(err);
  }
};
