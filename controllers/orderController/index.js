"use strict";

const Order = require("../../models/order");

// adds item in question to the user cart
exports.order_add_item_post = require("./addItemPost");

// adds coupon in question to the user cart
exports.order_add_coupon_post = require("./addCouponPost");

// Display order create form on GET.
exports.order_create_get = require("./createGet");

// Handle order create on POST.
exports.order_create_post = require("./createPost");

// Display order update form on GET. maps to /cart
exports.order_update_get = require("./updateCartGet");

// Handle order update on POST.
exports.order_update_post = require("./updateCartPost");

// Display detail page for a specific order.
exports.order_detail = require("./detail");

// Display list of all orders.
exports.order_list = require("./list");

// check user level
exports.CheckCreds = require("./CheckCreds");
