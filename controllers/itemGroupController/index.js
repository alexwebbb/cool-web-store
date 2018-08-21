"use strict";

// Display item_group create form on GET.
exports.group_create_get = require("./createGet");

// Handle group create on POST.
exports.group_create_post = require("./createPost");

// Display item_group delete form on GET.
exports.group_delete_get = require("./deleteGet");

// Handle item_group delete on POST.
exports.group_delete_post = require("./deletePost");

// Display item_group update form on GET.
exports.group_update_get = require("./updateGet");

// Handle item_group update on POST.
exports.group_update_post = require("./updatePost");

// Display detail page for a specific item_group.
exports.group_detail = require("./detail");

// Display list of all item_groups.
exports.group_list = require("./list");

// check user level
exports.CheckCreds = require("./CheckCreds");
