"use strict";

const express = require("express"),
  router = express.Router(),
  // Require controller modules.
  item_controller = require("../controllers/itemController"),
  item_group_controller = require("../controllers/itemGroupController"),
  coupon_controller = require("../controllers/couponController"),
  session_controller = require("../controllers/sessionController"),
  { ensureLoggedIn } = require("connect-ensure-login");

/// item ROUTES ///

// GET catalog home page.
router.get("/", item_controller.root);

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get("/item/create", ensureLoggedIn(), item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", ensureLoggedIn(), item_controller.item_create_post);

// GET request to delete item.
router.get(
  "/item/:id/delete",
  ensureLoggedIn(),
  item_controller.item_delete_get
);

// POST request to delete item.
router.post(
  "/item/:id/delete",
  ensureLoggedIn(),
  item_controller.item_delete_post
);

// GET request to update item.
router.get(
  "/item/:id/update",
  ensureLoggedIn(),
  item_controller.item_update_get
);

// POST request to update item.
router.post(
  "/item/:id/update",
  ensureLoggedIn(),
  item_controller.item_update_post
);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);

/// GROUP ROUTES ///

// GET request for creating a group. NOTE This must come before route that displays group (uses id).
router.get(
  "/group/create",
  ensureLoggedIn(),
  item_group_controller.group_create_get
);

//POST request for creating group.
router.post(
  "/group/create",
  ensureLoggedIn(),
  item_group_controller.group_create_post
);

// GET request to delete group.
router.get(
  "/group/:id/delete",
  ensureLoggedIn(),
  item_group_controller.group_delete_get
);

// POST request to delete group.
router.post(
  "/group/:id/delete",
  ensureLoggedIn(),
  item_group_controller.group_delete_post
);

// GET request to update group.
router.get(
  "/group/:id/update",
  ensureLoggedIn(),
  item_group_controller.group_update_get
);

// POST request to update group.
router.post(
  "/group/:id/update",
  ensureLoggedIn(),
  item_group_controller.group_update_post
);

// GET request for one group.
router.get("/group/:id", item_group_controller.group_detail);

// GET request for list of all group.
router.get("/groups", item_group_controller.group_list);

/// COUPON ROUTES ///

// GET request for creating a coupon. NOTE This must come before route that displays group (uses id).
router.get(
  "/coupon/create",
  ensureLoggedIn(),
  coupon_controller.coupon_create_get
);

//POST request for creating coupon.
router.post(
  "/coupon/create",
  ensureLoggedIn(),
  coupon_controller.coupon_create_post
);

// GET request to delete coupon.
router.get(
  "/coupon/:id/delete",
  ensureLoggedIn(),
  coupon_controller.coupon_delete_get
);

// POST request to delete coupon.
router.post(
  "/coupon/:id/delete",
  ensureLoggedIn(),
  coupon_controller.coupon_delete_post
);

// GET request to update coupon.
router.get(
  "/coupon/:id/update",
  ensureLoggedIn(),
  coupon_controller.coupon_update_get
);

// POST request to update coupon.
router.post(
  "/coupon/:id/update",
  ensureLoggedIn(),
  coupon_controller.coupon_update_post
);

// GET request for one coupon.
router.get("/coupon/:id", coupon_controller.coupon_detail);

// GET request for list of all coupon.
router.get("/coupons", coupon_controller.coupon_list);

/// SESSION ROUTES ///

// GET request for one session.
router.get("/session/:id", ensureLoggedIn(), session_controller.session_detail);

// GET request for list of all session.
router.get("/sessions", ensureLoggedIn(), session_controller.session_list);

module.exports = router;
