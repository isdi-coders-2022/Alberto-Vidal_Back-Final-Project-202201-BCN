/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const debug = require("debug")("PS_api:database:");
const chalk = require("chalk");
const { default: mongoose } = require("mongoose");

const connectDB = async (uri) => {
  mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  });
  try {
    await mongoose.connect(uri);
    debug(chalk.bgBlue.black("database connected"));
  } catch (error) {
    debug(chalk.red("error connecting database"));
  }
};

module.exports = connectDB;
