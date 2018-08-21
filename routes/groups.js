"use strict";

const express = require("express"),
  router = express.Router(),
  group_controller = require("../controllers/itemGroupController"),
  { CheckCreds } = group_controller,
  { ensureLoggedIn } = require("connect-ensure-login"),
  routeString = "/group/",
  routeStringPlural = "/groups";

// GET request for creating a group. NOTE This must come before route that displays group (uses id).
router.get(
  routeString + "create",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_create_get
);

//POST request for creating group.
router.post(
  routeString + "create",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_create_post
);

// GET request to delete group.
router.get(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_delete_get
);

// POST request to delete group.
router.post(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_delete_post
);

// GET request to update group.
router.get(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_update_get
);

// POST request to update group.
router.post(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  group_controller.group_update_post
);

// GET request for one group.
router.get(routeString + ":id", group_controller.group_detail);

// GET request for list of all group.
router.get(routeStringPlural, group_controller.group_list);

module.exports = router;
