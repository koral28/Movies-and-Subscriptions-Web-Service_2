var express = require("express");
var router = express.Router();
var UsersDB = require("../models/usersModelDB");
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

  UsersDB.find({}, function (err, users) {
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
          flag = true;
          permissions.map((per) => {
            // console.log(per.Id );
            // console.log(element._id);
            if (per.Id == element._id) {
              mySession.permissionsOfUser = per.Permissions;
              // console.log(mySession.permissionsOfUser)
            }
          });
        } else if (
          req.body.userName == element.UserName &&
          req.body.password == element.Password
        ) {
          mySession.authenticated = true;
          mySession.adminOrUser = "user";
          flag = true;
          permissions.map((per) => {
            if (per.Id == element._id) {
              mySession.permissionsOfUser = per.Permissions;
            }
          });
          usersFromJson.map((user) => {
            if (user.Id == element._id) {
              mySession.cookie.maxAge *= user.SessionTimeOut;
              
            }
          });
        }
      });

      if (flag) {
        // console.log(mySession.permissionsOfUser)
  
        res.status(200).json({success:true, mySession});
        // res.status(200).json({success:true})
        }
        else{
          res.status(200).json({success:false})
        }
    }
  });
});

router.post("/createNewUserAccount", async function (req, res, next) {
  //user is saved in db and only set his password!
  let mySession = req.session;
  mySession.userNameLoggedIn = req.body.userName;
  mySession.permissionsOfUser = [];
  mySession.cookie.maxAge = 60 * 1000;
  let findNameInDB = false;

  let usersFromJson = await Users.getUsersData().catch((err) =>
    console.log("caught it")
  );
  usersFromJson = usersFromJson.users;
  let permissions = await Permissions.getPermissionsData().catch((err) =>
    console.log("caught it")
  );
  permissions = permissions.permissions;

  UsersDB.find({}, function (err, users) {
    if (err) {
      res.send(err);
    } else {
      users.forEach((element) => {
        // console.log(req.body.userName)
        if (req.body.userName == element.UserName) {
          findNameInDB = true;
          UsersDB.updateMany(
            { UserName: req.body.userName },
            { Password: req.body.password },
            null,
            (error) => {
              if (error) {
                res.send(error);
              }
              if (
                req.body.userName == element.UserName &&
                element.UserName == "Koral Levi"
              ) {
                mySession.authenticated = true;
                mySession.adminOrUser = "admin";
                flag = true;
                permissions.map((per) => {
                  if (per.Id == element._id) {
                    mySession.permissionsOfUser = per.Permissions;
                  }
                });
              } else {
                mySession.adminOrUser = "user";
                permissions.map((per) => {
                  if (per.Id == element._id) {
                    mySession.permissionsOfUser = per.Permissions;
                  }
                });
                usersFromJson.map((user) => {
                  if (user.Id == element._id) {
                    mySession.cookie.maxAge *= user.SessionTimeOut;
                  }
                });
              }
              res.status(200).json({success:true, mySession});
            }
          );
        }
      });
      if (!findNameInDB) {
        res.status(200).json({success:false})
      }
    }
  });
});

module.exports = router;
