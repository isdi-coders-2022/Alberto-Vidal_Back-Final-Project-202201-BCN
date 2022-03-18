// eslint-disable-next-line no-unused-vars
const User = require("../../../database/models/User");
const Project = require("../../../database/models/Project");

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

const createNewProject = async (req, res, next) => {
  const newProject = req.body;
  try {
    const newProjectCreated = await Project.create(newProject);
    const populatedProject = await newProjectCreated.populate(
      "author",
      "username avatar id"
    );
    res.status(201).json(populatedProject);
  } catch (error) {
    error.message = "error creating project";
    next(error);
  }
};

const editProject = async (req, res, next) => {
  const projectToUpdate = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectToUpdate.id,
      {
        ...projectToUpdate,
        author: projectToUpdate.author.id,
      },
      { new: true }
    );

    const populatedUpdatedProject = await updatedProject.populate(
      "author",
      "username avatar id"
    );

    res.status(200).json(populatedUpdatedProject);
  } catch (error) {
    error.message = "error updating project";
    next(error);
  }
};

module.exports = {
  getAllProjects,
  deleteProject,
  createNewProject,
  editProject,
};
