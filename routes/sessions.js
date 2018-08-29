"use strict";

const express = require("express"),
  router = express.Router(),
  session_controller = require("../controllers/sessionController"),
  { CheckCreds } = session_controller,
  { ensureLoggedIn } = require("connect-ensure-login");

// DELETE all sessions
router.post(
  "/sessions",
  ensureLoggedIn(),
  CheckCreds,
  session_controller.clear_session_list
);

// GET request for list of all session.
router.get(
  "/sessions",
  ensureLoggedIn(),
  CheckCreds,
  session_controller.session_list
);

module.exports = router;
