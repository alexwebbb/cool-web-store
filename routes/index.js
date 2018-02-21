"use strict";

const express = require("express"),
	router = express.Router(),
	index_controller = require("../controllers/indexController");

/* GET home page. */
router.get("/", index_controller.index);

module.exports = router;
