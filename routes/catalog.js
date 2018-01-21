const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const item_group_controller = require("../controllers/itemGroupController");
const coupon_controller = require("../controllers/couponController");

/// item ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);

/// GROUP ROUTES ///

// GET request for creating a group. NOTE This must come before route that displays group (uses id).
router.get("/group/create", item_group_controller.group_create_get);

//POST request for creating group.
router.post("/group/create", item_group_controller.group_create_post);

// GET request to delete group.
router.get("/group/:id/delete", item_group_controller.group_delete_get);

// POST request to delete group.
router.post("/group/:id/delete", item_group_controller.group_delete_post);

// GET request to update group.
router.get("/group/:id/update", item_group_controller.group_update_get);

// POST request to update group.
router.post("/group/:id/update", item_group_controller.group_update_post);

// GET request for one group.
router.get("/group/:id", item_group_controller.group_detail);

// GET request for list of all group.
router.get("/groups", item_group_controller.group_list);

/// COUPON ROUTES ///

// GET request for creating a group. NOTE This must come before route that displays group (uses id).
router.get("/coupon/create", coupon_controller.coupon_create_get);

//POST request for creating coupon.
router.post("/coupon/create", coupon_controller.coupon_create_post);

// GET request to delete coupon.
router.get("/coupon/:id/delete", coupon_controller.coupon_delete_get);

// POST request to delete coupon.
router.post("/coupon/:id/delete", coupon_controller.coupon_delete_post);

// GET request to update coupon.
router.get("/coupon/:id/update", coupon_controller.coupon_update_get);

// POST request to update coupon.
router.post("/coupon/:id/update", coupon_controller.coupon_update_post);

// GET request for one coupon.
router.get("/coupon/:id", coupon_controller.coupon_detail);

// GET request for list of all coupon.
router.get("/coupons", coupon_controller.coupon_list);

module.exports = router;
