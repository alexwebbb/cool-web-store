"use strict";

const User = require("../../models/user"),
  monetize = val => {
    return "$" + val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  };

module.exports = async function(req, res, next) {
  try {
    let user = await User.findById(req.user._id)
      .populate("current_cart.item")
      .populate("active_coupons")
      .exec();

    if (user.current_cart.find(x => x.item === null)) {
      user.current_cart = user.current_cart.filter(x => x.item !== null);
      user = await User.findByIdAndUpdate(user._id, user, {});
    }

    let totalDiscount = 0;

    
    const adjustedCart = user.current_cart.map(({ item, quantity }) => {
      console.log(item.item_groups);
      console.log(user.active_coupons[0].valid_item_groups[0].toString());
      console.log(item.item_groups.indexOf(user.active_coupons[0].valid_item_groups[0]));
      let discount = 0;
      if (
        item.item_groups.indexOf(user.active_coupons[0].valid_item_groups[0]) != -1
      ) {
        discount = item.price * (user.active_coupons[0].discount_percent / 100);
      }
      totalDiscount += discount * quantity;

      const adjustedprice = discount ? item.price - discount : item.price,
        subtotalValue = adjustedprice * quantity,
        subtotalText = discount
          ? monetize(item.price * quantity) + " - " + monetize(discount * quantity)
          : monetize(subtotalValue);

          console.log(monetize(item.price * quantity) + " - " + monetize(discount * quantity));

      return {
        item,
        price: monetize(item.price),
        quantity,
        subtotal: subtotalText,
        subtotalValue
      };
    });

    const total = adjustedCart.reduce((a, c) => {
      return a + c.subtotalValue;
    }, 0);

    res.render("order/cart_form", {
      title: "Cart",
      cart_total: monetize(total),
      totalDiscount: monetize(totalDiscount),
      coupons: user.active_coupons,
      user_cart: adjustedCart,
      user_coupons: user.active_coupons
    });
  } catch (err) {
    return next(err);
  }
};
