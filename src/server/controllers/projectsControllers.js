const Project = require("../../database/models/Project");

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("author");

    res.json(projects);
  } catch (error) {
    error.message = "error getting projects";
    next(error);
  }
};
module.exports = { getAllProjects };
