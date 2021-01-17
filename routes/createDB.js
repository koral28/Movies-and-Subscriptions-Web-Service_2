var express = require("express");
var router = express.Router();
var Users = require("../models/usersModelDB");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let flag = 1;

  const user = new Users({
    UserName: "Koral Levi",
    Password: "1234",
  });

  console.log(user);

  user.save(function (err) {
    if (err) {
     console.log(err);
    flag = 0;
    } else {
      console.log("User Saved!");
    }
  });

  if (flag == 1) {
    res.send("DB CREATED!");
  }
});

module.exports = router;
