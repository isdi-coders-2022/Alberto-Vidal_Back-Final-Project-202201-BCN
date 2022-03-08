const { Schema } = require("mongoose");

const LinksSchema = new Schema({
  production: { type: String },
  repo: { type: String, required: true },
});

module.exports = LinksSchema;
