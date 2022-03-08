const { Schema } = require("mongoose");
const LinksSchema = require("./LinksSchema");

const ProjectSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  likes: { type: Number, default: 0 },
  preview: { type: String, required: true },
  links: { type: LinksSchema, required: true },
});

module.exports = ProjectSchema;
