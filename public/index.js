"use strict";

$("#js-main").click(() => {
	console.log("hello");
	$("#js-aside-pre").toggleClass("col-md-1 col-md-4");
	$("#js-main").toggleClass("col-md-12 col-md-8 offset-md-4");
});
