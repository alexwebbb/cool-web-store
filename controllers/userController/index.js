"use strict";

// special function to run to create the root user
exports.start = require("./start");

// Display User create form on GET.
exports.user_create_get = require("./createGet");

// Display user create form on post.
exports.user_create_post = require("./createPost");

// Handle user delete on POST.
exports.user_delete_get = require("./deleteGet");

// Handle user delete on POST.
exports.user_delete_post = require("./deletePost");

// Display user update form on GET.
exports.user_update_get = require("./updateGet");

// Handle user update on POST.
exports.user_update_post = require("./updatePost");

// Display detail page for a specific user.
exports.user_detail = require("./detail");

// Display list of all users.
exports.user_list = require("./list");

// check user level
exports.CheckCreds = require("./CheckCreds");