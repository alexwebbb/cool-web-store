"use strict";

const express = require("express"),
  router = express.Router(),
  coupon_controller = require("../controllers/couponController"),
  { CheckCreds } = coupon_controller,
  { ensureLoggedIn } = require("connect-ensure-login");

router.get(
  "/coupon/create",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_create_get
);

//POST request for creating coupon.
router.post(
  "/coupon/create",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_create_post
);

// GET request to delete coupon.
router.get(
  "/coupon/:id/delete",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_delete_get
);

// POST request to delete coupon.
router.post(
  "/coupon/:id/delete",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_delete_post
);

// GET request to update coupon.
router.get(
  "/coupon/:id/update",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_update_get
);

// POST request to update coupon.
router.post(
  "/coupon/:id/update",
  ensureLoggedIn(),
  CheckCreds,
  coupon_controller.coupon_update_post
);

// GET request for one coupon.
router.get("/coupon/:id", coupon_controller.coupon_detail);

// GET request for list of all coupon.
router.get("/coupons", coupon_controller.coupon_list);

module.exports = router;
