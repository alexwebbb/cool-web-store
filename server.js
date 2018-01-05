"use strict";

const express = require("express");
const app = express();
const path = require("path");

const stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

stripe.charges.retrieve("ch_1Bgprn2eZvKYlo2CfqGNWziM").then(function(charge) {
	console.log(charge);
});

app.use(express.static("public"));

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
