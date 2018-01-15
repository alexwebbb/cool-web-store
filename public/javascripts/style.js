"use strict";

$("#js-main").click(() => {
	console.log("hello");
	$("#js-aside-pre").toggleClass("col-md-1 col-md-4");
	$("#js-main").toggleClass("col-md-12 col-md-8 offset-md-4");
});

const stripe = Stripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh"),
	elements = stripe.elements(),
	cardElement = elements.create("card");