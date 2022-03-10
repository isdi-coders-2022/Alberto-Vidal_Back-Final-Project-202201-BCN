const { model } = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

const User = model("User", UserSchema, "users");

module.exports = User;
