#! /usr/bin/env node

console.log("This script populates some test data to the database.");

const async = require("async"),
  Item = require("./models/item"),
  Group = require("./models/item_group"),
  Coupon = require("./models/coupon");

const mongoose = require("mongoose"),
  keys = require("./config/keys");
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

const items = [],
  groups = [],
  coupons = [];

function couponCreate(name, description, discount, groups, cb) {
  const coupon = new Coupon({
    name: name,
    description: description,
    discount_percent: parseInt(discount),
    valid_item_groups: groups
  });

  coupon.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Coupon: " + coupon);
    coupons.push(coupon);
    cb(null, coupon);
  });
}

function groupCreate(name, cb) {
  const group = new Group({ name: name });

  group.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Group: " + group);
    groups.push(group);
    cb(null, group);
  });
}

function itemCreate(title, description, price, group, cb) {
  const itemDetail = {
    title: title,
    description: description,
    price_history: [{ price: parseInt(price) }]
  };

  if (group != false) itemDetail.group = group;

  const item = new Item(itemDetail);

  item.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Book: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createGroupsNCoupons(cb) {
  async.parallel(
    [
      function(callback) {
        groupCreate("All", callback);
      },
      function(callback) {
        groupCreate("Fantasy", callback);
      },
      function(callback) {
        groupCreate("French Poetry", callback);
      },
      function(callback) {
        groupCreate("Science Fiction", callback);
      },
      function(callback) {
        couponCreate(
          "Fun Mode",
          "This coupon is for fun mode fest",
          "10",
          [groups[0]],
          callback
        );
      },
      function(callback) {
        couponCreate(
          "Sad Mode",
          "This coupon is for sad people",
          "50",
          [groups[2]],
          callback
        );
      },
      function(callback) {
        couponCreate(
          "Starwind Mode",
          "This coupon is for people with expendable income",
          "5",
          [groups[1], groups[3]],
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function(callback) {
        itemCreate(
          "Scepter of Power",
          "An Incredibly powerful scepter",
          "225.00",
          [groups[0], groups[1]],
          cb
        );
      },
      function(callback) {
        itemCreate(
          "La Fete",
          "An interesting book",
          "5.00",
          [groups[0], groups[2]],
          cb
        );
      },
      function(callback) {
        itemCreate(
          "Rocket Ship",
          "A powerful rocket ship, designed to reach Jupiter. Fuel not included",
          "670,000,000,000.00",
          [groups[0], groups[3]],
          cb
        );
      },
      function(callback) {
        itemCreate(
          "The Gambler",
          "The 1978 album by Kenny Rogers",
          "12.95",
          [groups[0], groups[1]],
          cb
        );
      },
      function(callback) {
        itemCreate(
          "Interstella 5555",
          "The 2003 music film by Daft Punk",
          "21.95",
          [groups[0], groups[2], groups[3]],
          cb
        );
      },
      function(callback) {
        itemCreate("Trash Bin", "Plastic trash bin", "15.00", [groups[0]], cb);
      }
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGroupsNCoupons, createItems],
  // optional callback
  function(err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + bookinstances);
    }
    //All done, disconnect from database
    mongoose.connection.close();
  }
);
