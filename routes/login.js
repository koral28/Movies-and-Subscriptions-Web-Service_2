var express = require("express");
var router = express.Router();
var UserDB = require("../models/usersModelDB");
var Permissions = require("../models/PermissionsDal");
var Users = require("../models/UsersDal");

router.post("/login", async function (req, res, next) {
  let mySession = req.session;
  mySession.userNameLoggedIn = req.body.userName;
  mySession.permissionsOfUser = [];
  mySession.cookie.maxAge = 60 * 1000;

  let usersFromJson = await Users.getUsersData().catch((err) =>
    console.log("caught it")
  );
  usersFromJson = usersFromJson.users;
  let permissions = await Permissions.getPermissionsData().catch((err) =>
    console.log("caught it")
  );
  permissions = permissions.permissions;

  UserDB.find({}, function (err, users) {
    let flag = false;
    if (err) {
      res.send(err);
    } else {
      users.forEach((element) => {
        if (
          req.body.userName == element.UserName &&
          req.body.password == element.Password &&
          element.UserName == "Koral Levi"
        ) {
          mySession.authenticated = true;
          mySession.adminOrUser = "admin";
          // mySession.cookie.maxAge *= element.SessionTimeOut;
          flag = true;
          permissions.map((per) => {
            if (per.Id == element._id) {
              mySession.permissionsOfUser = per.Permissions;
            }
          });
        } else if (
          req.body.userName == element.UserName &&
          req.body.password == element.Password
        ) {
          mySession.authenticated = true;
          mySession.adminOrUser = "user";
          // mySession.cookie.maxAge *= element.SessionTimeOut;
          flag = true;
          permissions.map((per) => {
            if (per.Id == element._id) {
              mySession.permissionsOfUser = per.Permissions;
            }
          });
        }
      });

      if (flag) {
        res.status(200).json({ success: true, mySession });
      } else {
        res.status(200).json({ success: false });
      }
    }
  });
});

router.post("/createNewUserAccount", async function (req, res, next) {
  let mySession = req.session;
  mySession.userNameLoggedIn = req.body.userName;
  mySession.permissionsOfUser = [];
  // mySession.cookie.maxAge = 60 * 1000;
  try {
    //create new user
    const newUser = await new UserDB({
      UserName: req.body.userName,
      Password: req.body.password,
    });
    //save to db
    const user = await newUser.save();

    //save to json
    let usersFromJson = await Users.getUsersData().catch((err) =>
      console.log("caught it")
    );

    string = newUser.UserName.split(" ");
    const userToJson = {
      Id: newUser._id,
      FirstName: string[0],
      LastName: string[1],
      CreatedDate: new Date().toLocaleDateString(),
      SessionTimeOut: 4,
    };

    //SAVE USER TO JSON
    await Users.writeUsersData({
      users: [...usersFromJson.users, userToJson],
    }).catch((err) => console.log("caught it"));
    //READ AGAIN THE NEW JSON AFTER ADD THE NEW USER
    usersFromJson = await Users.getUsersData().catch((err) =>
      console.log("caught it")
    );

    //save to permissions
    let userPermissions = {
      Id: newUser._id,
      Permissions: [
        "CreateMovies",
        "DeleteMovies",
        "ViewMovies",
        "UpdateMovies",
        "ViewSubscriptions",
        "DeleteSubscriptions",
        "CreateSubscriptions",
        "UpdateSubscriptions",
      ],
    };
    let permissions = await Permissions.getPermissionsData().catch((err) =>
      console.log("caught it")
    );

    await Permissions.writePermissionsData({
      permissions: [...permissions.permissions, userPermissions],
    }).catch((err) => console.log("caught it"));
    mySession.authenticated = true;
    mySession.adminOrUser = "user";
    permissions = await Permissions.getPermissionsData().catch((err) =>
      console.log("caught it")
    );
    permissions = permissions.permissions;
    permissions.map((per) => {
      mySession.permissionsOfUser = per.Permissions;
    });
    res.status(200).json({ success: true, mySession });
  } catch (err) {
    res.status(200).json({ success: false });
  }
});

module.exports = router;
