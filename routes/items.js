"use strict";

const express = require("express"),
  router = express.Router(),
  item_controller = require("../controllers/itemController"),
  { CheckCreds } = item_controller,
  { ensureLoggedIn } = require("connect-ensure-login"),
  routeString = "/item/",
  routeStringPlural = "/items";

// GET catalog home page.
router.get("/", item_controller.root);

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get(
  routeString + "create",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_create_get
);

// POST request for creating item.
router.post(
  routeString + "create",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_create_post
);

// GET request to delete item.
router.get(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_delete_get
);

// POST request to delete item.
router.post(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_delete_post
);

// GET request to update item.
router.get(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_update_get
);

// POST request to update item.
router.post(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  item_controller.item_update_post
);

// GET request for one item.
router.get(routeString + ":id", item_controller.item_detail);

// GET request for list of all item items.
router.get(routeStringPlural, item_controller.item_list);

module.exports = router;
