const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  posts: { type: [Schema.Types.ObjectId], ref: "Project", default: [] },
  bookmarks: { type: [Schema.Types.ObjectId], ref: "Project", default: [] },
  liked: { type: [Schema.Types.ObjectId], ref: "Project", default: [] },
  avatar: { type: String, required: true },
});

module.exports = UserSchema;
