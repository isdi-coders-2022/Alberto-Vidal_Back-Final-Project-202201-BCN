const { model } = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

const User = model("user", UserSchema, "users");

module.exports = User;
