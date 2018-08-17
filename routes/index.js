"use strict";

const express = require("express"),
  router = express.Router(),
  root_controller = require("../controllers/rootController");

/* GET home page. */
router.get("/", root_controller.root);

/* GET home page. */
router.get("/about", root_controller.about);

module.exports = router;
