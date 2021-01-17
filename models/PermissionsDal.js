const jsonfile = require("jsonfile");

exports.getPermissionsData = function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/Permissions.json", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.writePermissionsData = function (permissions) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + "/Permissions.json", permissions, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Succeeded");
      }
    });
  });
};
