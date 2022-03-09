const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: { type: String, required: false },
  password: { type: String, required: true },
  posts: { type: Schema.Types.ObjectId, ref: "project" },
  bookmarks: { type: Schema.Types.ObjectId, ref: "project" },
  liked: { type: Schema.Types.ObjectId, ref: "project" },
  avatar: { type: String, required: true },
});

module.exports = UserSchema;
