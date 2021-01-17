var express = require("express");
var router = express.Router();
var Members = require("../models/membersWSModel");
var Movies = require("../models/moviesWSModel");
var Subscriptions = require("../models/subscriptionsWSModel");

router.get("/", async function (req, res, next) {

});

module.exports = router;
