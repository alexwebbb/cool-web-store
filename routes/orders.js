"use strict";

const express = require("express"),
  router = express.Router(),
  order_controller = require("../controllers/orderController"),
  { CheckCreds } = order_controller,
  { ensureLoggedIn } = require("connect-ensure-login");

/// SHOPPING CART MODIFICATION ROUTES ///

// POST request for creating item.
router.post(
  "/item/:id/add",
  ensureLoggedIn(),
  order_controller.order_add_item_post
);
// POST request for clearing the coupons
router.post(
  "/coupon/remove",
  ensureLoggedIn(),
  order_controller.order_remove_coupon_post
);
// POST request for applying a coupon
router.post(
  "/coupon/add",
  ensureLoggedIn(),
  order_controller.order_add_coupon_post
);

/// ORDER CREATION AND MODIFICATION ROUTES ///

// GET request for creating a order.
router.get("/checkout", ensureLoggedIn(), order_controller.order_create_get);

// POST request for creating order.
router.post("/charge", ensureLoggedIn(), order_controller.order_create_post);

// GET request to update order.
router.get("/cart", ensureLoggedIn(), order_controller.order_update_get);

// POST request to update order.
router.post("/cart", ensureLoggedIn(), order_controller.order_update_post);

/// ORDER VIEWING ROUTES ///

// GET request for one order.
router.get(
  "/order/:id",
  ensureLoggedIn(),
  CheckCreds,
  order_controller.order_detail
);

// GET request for list of all user orders.
router.get(
  "/orders",
  ensureLoggedIn(),
  CheckCreds,
  order_controller.order_list
);

module.exports = router;
