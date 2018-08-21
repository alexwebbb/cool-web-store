"use strict";

// Display coupon create form on GET.
exports.coupon_create_get = require("./createGet");

// Handle coupon create on POST.
exports.coupon_create_post = require("./createPost");

// Display coupon delete form on GET.
exports.coupon_delete_get = require("./deleteGet");

// Handle coupon delete on POST.
exports.coupon_delete_post = require("./deletePost");

// Display coupon update form on GET.
exports.coupon_update_get = require("./updateGet");

// Handle coupon update on POST.
exports.coupon_update_post = require("./updatePost");

// Display detail page for a specific coupon.
exports.coupon_detail = require("./detail");

// Display list of all coupon.
exports.coupon_list = require("./list");

// check user level
exports.CheckCreds = require("./CheckCreds");
