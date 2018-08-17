"use strict";

const express = require("express"),
  router = express.Router(),
  user_controller = require("../controllers/userController"),
  { ensureLoggedIn } = require("connect-ensure-login");

// Special route for creating root user. Only works when database is empty, requires query string
router.get("/start/", user_controller.start);

// GET request for creating a user. NOTE This must come before routes that display user (uses id).
router.get("/user/create", user_controller.user_create_get);

// POST request for creating user.
router.post("/user/create", user_controller.user_create_post);

// GET request to delete user.
router.get(
  "/user/:id/delete",
  ensureLoggedIn(),
  user_controller.user_delete_get
);

// POST request to delete user.
router.post(
  "/user/:id/delete",
  ensureLoggedIn(),
  user_controller.user_delete_post
);

// GET request to update user.
router.get(
  "/user/:id/update",
  ensureLoggedIn(),
  user_controller.user_update_get
);

// POST request to update user.
router.post(
  "/user/:id/update",
  ensureLoggedIn(),
  user_controller.user_update_post
);

// GET request for one user.
router.get("/user/:id", ensureLoggedIn(), user_controller.user_detail);

// GET request for list of all user users.
router.get("/users", ensureLoggedIn(), user_controller.user_list);

module.exports = router;
