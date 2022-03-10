// eslint-disable-next-line no-unused-vars
const User = require("../../database/models/User");
const Project = require("../../database/models/Project");

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate(
      "author",
      "username avatar id"
    );

    res.json({ projects });
  } catch (error) {
    error.message = "error getting projects";
    next(error);
  }
};
module.exports = { getAllProjects };
