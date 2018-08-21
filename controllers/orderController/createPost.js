"use strict";

const Order = require("../../models/order"),
  User = require("../../models/user"),
  keys = require("../../config/keys"),
  stripe = require("stripe")(keys.stripeSecret);

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user._id, "current_cart")
      .populate("current_cart.item")
      .populate("current_cart.item.price_history.price")
      .exec();

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const total = user.current_cart.reduce((a, c) => {
        return a + c.quantity * c.item.price;
      }, 0),
      totalTimes100 = total * 100,
      newCart = user.current_cart.map(function(element) {
        const item = element.item;
        return {
          item: {
            name: item.name,
            description: item.description,
            price: item.price,
            img_100: item.img_100,
            img_700_400: item.img_700_400,
            item_groups: item.item_groups,
            id: item._id
          },
          quantity: element.quantity
        };
      }),
      order = new Order({
        user: req.user._id,
        cart: newCart,
        total: total
      });

    // submit charge to stripe servers
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      }),
      charge = await stripe.charges.create({
        totalTimes100,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      });
    // create an order from the cart
    await order.save();
    // remove the cart from the user object
    user.current_cart = [];
    await user.save();
    // Successful - redirect to confirmation screen.
    res.render("order/charge_result", {
      title: "Payment Complete",
      total,
      charge
    });
  } catch (err) {
    return next(err);
  }
};
