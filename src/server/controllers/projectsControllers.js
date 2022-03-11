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

const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    const error = new Error("invalid id");
    error.status = 400;
    next(error);
    return;
  }

  try {
    await Project.deleteOne({ id });
    res.json({});
  } catch (error) {
    error.message = "error deleting project";
    next(error);
  }
};

module.exports = { getAllProjects, deleteProject };
