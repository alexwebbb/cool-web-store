"use strict";

const Monetize = require("./../../utils/Monetize");

module.exports = (cart, active_coupons) => {
  let totalDiscount = 0;

  const adjustedCart = cart.map(({ item, quantity }) => {
    let discount = 0;
    if (
      item.item_groups.indexOf(active_coupons[0].valid_item_groups[0]) != -1
    ) {
      discount = item.price * (active_coupons[0].discount_percent / 100);
    }
    totalDiscount += discount * quantity;

    const adjustedprice =
        (discount ? item.price - discount : item.price) * quantity,
      subtotalValue = Monetize(item.price * quantity),
      subtotalDiscount = discount ? " - " + Monetize(discount * quantity) : "";

    return {
      item: item.toObject({ getters: true, virtuals: true }),
      adjustedprice,
      quantity,
      subtotalDiscount,
      subtotalValue
    };
  });

  const total = adjustedCart.reduce((a, c) => {
    return a + c.adjustedprice;
  }, 0);

  return { adjustedCart, totalDiscount, total };
};
