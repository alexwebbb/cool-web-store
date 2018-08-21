"use strict";

const express = require("express"),
  router = express.Router(),
  session_controller = require("../controllers/sessionController"),
  { CheckCreds } = session_controller,
  { ensureLoggedIn } = require("connect-ensure-login");

// GET request for one session.
router.get("/session/:id", ensureLoggedIn(), CheckCreds, session_controller.session_detail);

// GET request for list of all session.
router.get("/sessions", ensureLoggedIn(), CheckCreds, session_controller.session_list);

module.exports = router;
