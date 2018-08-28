"use strict";

const Order = require("../../models/order"),
  User = require("../../models/user"),
  keys = require("../../config/keys"),
  stripe = require("stripe")(keys.stripeSecret),
  GenerateCartData = require("./GenerateCartData");

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user._id, "current_cart")
      .populate("current_cart.item")
      .populate("active_coupons")
      .exec();

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const { total, adjustedCart } = GenerateCartData(user.current_cart, user.active_coupons),
      order = new Order({
        user: req.user._id,
        cart: adjustedCart,
        coupons_present: user.active_coupons,
        total: total
      });

    // submit charge to stripe servers
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      }),
      charge = await stripe.charges.create({
        amount: total * 100,
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
