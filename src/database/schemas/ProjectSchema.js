const { Schema } = require("mongoose");

const ProjectSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  likes: { type: Number, default: 0 },
  preview: { type: String, required: true },
  repo: { type: String, required: true },
  production: { type: String, required: true },
});

module.exports = ProjectSchema;
