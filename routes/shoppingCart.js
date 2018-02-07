"use strict";

const express = require("express"),
	router = express.Router(),
	user_controller = require("../controllers/userController"),
	{ ensureLoggedIn } = require("connect-ensure-login");

/// SHOPPING CART & ORDER ROUTES ///

// GET request for creating a order.
router.get("/cart/checkout", ensureLoggedIn(), order_controller.order_create_get);

// POST request for creating order.
router.post("/cart/checkout", ensureLoggedIn(), order_controller.order_create_post);

// GET request to clear cart.
router.get("/cart/empty", ensureLoggedIn(), order_controller.order_delete_get);

// POST request to clear cart.
router.post("/cart/empty", ensureLoggedIn(), order_controller.order_delete_post);

// GET request to update order.
router.get("/cart", ensureLoggedIn(), order_controller.order_update_get);

// POST request to update order.
router.post("/cart", ensureLoggedIn(), order_controller.order_update_post);

// GET request for one order.
router.get("/order/:id", ensureLoggedIn(), order_controller.order_detail);

// GET request for list of all of a single user's orders. a route available only to admin, as it will check if you are admin
router.get("/orders/:id", ensureLoggedIn(), order_controller.order_list);

// GET request for list of all user orders.
router.get("/orders", ensureLoggedIn(), order_controller.order_list);
