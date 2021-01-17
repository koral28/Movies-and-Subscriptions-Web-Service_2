const express = require("express");
const router = express.Router();
var Permissions = require("../models/PermissionsDal");

router.route("/").get( async function (req, resp) {
  let permissions = await Permissions.getPermissionsData();
  return resp.json(permissions);
});
module.exports = router;