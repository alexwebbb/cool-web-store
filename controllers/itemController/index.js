"use strict";

// the root view
exports.root = require("./root");

// Display item create form on GET.
exports.item_create_get = require("./createGet");

// Display item create form on post.
exports.item_create_post = require("./createPost");

// Display item delete form on GET.
exports.item_delete_get = require("./deleteGet");

// Handle item delete on POST.
exports.item_delete_post = require("./deletePost");

// Display item update form on GET.
exports.item_update_get = require("./updateGet");

// Handle item update on POST.
exports.item_update_post = require("./updatePost");

// Display detail page for a specific item.
exports.item_detail = require("./detail");

// Display list of all items.
exports.item_list = require("./list");

// check user level
exports.CheckCreds = require("./CheckCreds");
