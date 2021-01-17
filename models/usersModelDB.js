const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let usersSchema = new Schema({
  UserName: String,
  Password: String,
});

//the third is the collection name
module.exports = mongoose.model("Users", usersSchema);
