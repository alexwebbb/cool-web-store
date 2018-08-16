"use strict";

const Order = require("../../models/order"),
  User = require("../../models/user"),
  keys = require("../../config/keys"),
  async = require("async"),
  stripe = require("stripe")(keys.stripeSecret);

module.exports = function(req, res, next) {
  User.findById(req.user._id, "current_cart")
    .populate("current_cart.item")
    .populate("current_cart.item.price_history.price")
    .exec(function(err, user) {
      if (err) return next(err);
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

      async.series(
        [
          function(callback) {
            // submit charge to stripe servers
            stripe.customers
              .create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken
              })
              .then(customer => {
                stripe.charges.create({
                  totalTimes100,
                  description: "Sample Charge",
                  currency: "usd",
                  customer: customer.id
                });
              })
              .then(charge => {
                callback(null, charge);
              });
          },
          function(callback) {
            // create an order from the cart
            order.save(function(err) {
              if (err) {
                console.log(err);
                return next(err);
              }
              callback(null);
            });
          },
          function(callback) {
            // remove the cart from the user object
            user.current_cart = [];
            user.save().then(function(res) {
              console.log("cart cleared");
              callback(null);
            });
          }
        ],
        function(err, results) {
          // Successful - redirect to confirmation screen.
          res.render("order/charge_result", {
            title: "Payment Complete",
            total: total,
            charge: results
          });
        }
      );
    });
};