const express = require("express");
const router = express.Router();
var Users = require("../models/usersModelDB");
var Permissions = require("../models/PermissionsDal");
var UsersJson = require("../models/UsersDal");

router.route("/").get( async function (req, resp) {
  let usersFronJson = await UsersJson.getUsersData();
  return resp.json(usersFronJson);
});

router.route("/").post(async function (req, resp) {
    let usersFromJson = await UsersJson.getUsersData().catch((err) =>
      console.log("caught it")
    );
    const newUser = new Users({
      UserName: req.body.FirstName +" "+ req.body.LastName,
      Password: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    newUser.save(async function (err) {
      if (err) {
        return resp.send(err);
      }
      else{
        //ADD TO PERSMISSIONS JSON
        let userPermissions = {
          Id: newUser._id,
          Permissions: [],
        };
      
        if (req.body.ViewSubscriptions) {
          userPermissions.Permissions.push("ViewSubscriptions");
        }
        if (req.body.CreateSubscriptions) {
          userPermissions.Permissions.push("CreateSubscriptions");
        }
        if (req.body.DeleteSubscriptions) {
          userPermissions.Permissions.push("DeleteSubscriptions");
        }
        if (req.body.UpdateSubscription) {
          userPermissions.Permissions.push("UpdateSubscription");
        }
        if (req.body.ViewMovies) {
          userPermissions.Permissions.push("ViewMovies");
        }
        if (req.body.CreateMovies) {
          userPermissions.Permissions.push("CreateMovies");
        }
        if (req.body.DeleteMovies) {
          userPermissions.Permissions.push("DeleteMovies");
        }
        if (req.body.UpdateMovies) {
          userPermissions.Permissions.push("UpdateMovies");
        }
      
      
        //READ PERMISSIONS-ADD-READ ALL AGAIN-SEND
        let permissions = await Permissions.getPermissionsData().catch((err) =>
          console.log("caught it")
        );

        await Permissions.writePermissionsData({
          permissions: [...permissions.permissions, userPermissions],
        }).catch((err) => console.log("caught it"));
        permissions = await Permissions.getPermissionsData().catch((err) =>
          console.log("caught it")
        );
        
      
        //STORING NEW USER WE ARE ADDING
        let user = {
          Id: newUser._id,
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          CreatedDate: new Date().toLocaleDateString(),
          SessionTimeOut: req.body.SeesionTimeOut,
        };
        //SAVE USER TO JSON
        result = await UsersJson.writeUsersData({
          users: [...usersFromJson.users, user],
        }).catch((err) => console.log("caught it"));
        //READ AGAIN THE NEW JSON AFTER ADD THE NEW USER
        usersFromJson = await UsersJson.getUsersData().catch((err) =>
          console.log("caught it")
        );

        return resp.send("Saved!");
      }
        });
});

router.route("/:userId").put(async function (req, resp) {
  let usersFromJson = await UsersJson.getUsersData().catch((err) =>
  console.log("caught it")
);
  let permissions = await Permissions.getPermissionsData().catch((err) =>
  console.log("caught it")
);
const updatedUser = {
  UserName: req.body.FirstName + " " + req.body.LastName,
};
console.log(updatedUser)
  Users.update({ _id: req.params.userId }, updatedUser, async function (err) {
    if (err) {
      return resp.send(err);
    }
    else{
    //UPDATE PERMISSIONS IN JSON-move to function
      let newPermissionsArr = [];
      if (req.body.ViewSubscriptions) {
        newPermissionsArr.push("ViewSubscriptions");
      } else {
        newPermissionsArr.splice(0, 1);
      }
      if (req.body.CreateSubscriptions) {
        newPermissionsArr.push("CreateSubscriptions");
      } else {
        newPermissionsArr.splice(1, 1);
      }
      if (req.body.DeleteSubscriptions) {
        newPermissionsArr.push("DeleteSubscriptions");
      } else {
        newPermissionsArr.splice(2, 1);
      }
      if (req.body.UpdateSubscription) {
        newPermissionsArr.push("UpdateSubscription");
      } else {
        newPermissionsArr.splice(3, 1);
      }
      if (req.body.ViewMovies) {
        newPermissionsArr.push("ViewMovies");
      } else {
        newPermissionsArr.splice(4, 1);
      }
      if (req.body.CreateMovies) {
        newPermissionsArr.push("CreateMovies");
      } else {
        newPermissionsArr.splice(5, 1);
      }
      if (req.body.DeleteMovies) {
        newPermissionsArr.push("DeleteMovies");
      } else {
        newPermissionsArr.splice(6, 1);
      }
      if (req.body.UpdateMovies) {
        newPermissionsArr.push("UpdateMovies");
      } else {
        newPermissionsArr.splice(7, 1);
      }

      permissions.permissions.map((permission) => {
        if (permission.Id == req.params.userId) {
          permission.Permissions = newPermissionsArr;
        }
      });
      await Permissions.writePermissionsData({
        permissions: permissions.permissions,
      }).catch((err) => console.log("caught it"));
      //THE NEW PERMISSIONS JSON
      permissions = await Permissions.getPermissionsData().catch((err) =>
        console.log("caught it")
      );
      //UPDATE USER IN JSON
      usersFromJson.users.map((user) => {
        if (user.Id == req.params.userId) {
          user.Id = user.Id;
          user.FirstName = req.body.FirstName;
          user.LastName = req.body.LastName;
          user.CreatedDate = req.body.CreatedDate;
          user.SessionTimeOut = req.body.SeesionTimeOut;
        }
      });
     
      await UsersJson.writeUsersData({
        users: usersFromJson.users,
      }).catch((err) => console.log("caught it"));

      //THE NEW USERS JSON
      usersFromJson = await UsersJson.getUsersData().catch((err) =>
      console.log("caught it")
    );

      return resp.send("Updated!");
    }
      });
});

router.route("/:userId").delete(async function (req, resp) {
      let usersFromJson = await UsersJson.getUsersData().catch((err) =>
      console.log("caught it")
    );
    let permissions = await Permissions.getPermissionsData().catch((err) =>
      console.log("caught it")
    );
    //DELETE FROM USER JSON
    let newUsersArray = usersFromJson.users.filter(
      (user) => user.Id != req.params.userId
    );

    await UsersJson.writeUsersData({
      users: newUsersArray,
    }).catch((err) => console.log("caught it"));


    usersFromJson = await UsersJson.getUsersData().catch((err) =>
    console.log("caught it")
  );

    //DELETE FROM PERMISSIONS JSON
    let newPermissionsArray = permissions.permissions.filter(
      (permission) => permission.Id != req.params.userId
    );
    await Permissions.writePermissionsData({
      permissions: newPermissionsArray,
    }).catch((err) => console.log("caught it"));
    permissions = await Permissions.getPermissionsData().catch((err) =>
      console.log("caught it")
    );
    //DELETE FROM DB
    Users.remove({ _id: req.params.userId }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted!");
      }
    });

    return resp.send("Deleted!");
});


module.exports = router;
