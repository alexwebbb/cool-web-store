"use strict";

const express = require("express"),
  router = express.Router(),
  user_controller = require("../controllers/userController"),
  { CheckCreds } = user_controller,
  { ensureLoggedIn } = require("connect-ensure-login"),
  routeString = "/user/",
  routeStringPlural = "/users";

// Special route for creating root user. Only works when database is empty
router.get("/start/", user_controller.start);

// GET request for creating a user. NOTE This must come before routes that display user (uses id).
router.get(routeString + "create", CheckCreds, user_controller.user_create_get);

// POST request for creating user.
router.post(routeString + "create", CheckCreds, user_controller.user_create_post);

// GET request to delete user.
router.get(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  user_controller.user_delete_get
);

// POST request to delete user.
router.post(
  routeString + ":id/delete",
  ensureLoggedIn(),
  CheckCreds,
  user_controller.user_delete_post
);

// GET request to update user.
router.get(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  user_controller.user_update_get
);

// POST request to update user.
router.post(
  routeString + ":id/update",
  ensureLoggedIn(),
  CheckCreds,
  user_controller.user_update_post
);

// GET request for one user.
router.get(
  routeString + ":id",
  ensureLoggedIn(),
  CheckCreds,
  user_controller.user_detail
);

// GET request for list of all user users.
router.get(routeStringPlural, ensureLoggedIn(), CheckCreds, user_controller.user_list);

module.exports = router;
