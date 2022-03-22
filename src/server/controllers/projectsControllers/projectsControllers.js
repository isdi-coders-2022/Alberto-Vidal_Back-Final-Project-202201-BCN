/* eslint-disable no-param-reassign */
require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
// eslint-disable-next-line no-unused-vars
const User = require("../../../database/models/User");
const Project = require("../../../database/models/Project");
const storage = require("../../firebase");

const resourcesFolder = "uploads";
const firebaseDestinationFolder = "previews";

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
  try {
    const imageName = req.file.originalname;
    const imagePath = path.join(resourcesFolder, imageName);
    await fs.rename(path.join(resourcesFolder, req.file.filename), imagePath);

    const image = await fs.readFile(imagePath);

    const imageReference = ref(
      storage,
      `${firebaseDestinationFolder}/${req.file.originalname}`
    );
    await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(imageReference);
    const newProject = await Project.create({
      ...req.body,
      preview: imageUrl,
    });
    const populatedProject = await newProject.populate(
      "author",
      "username avatar id"
    );
    res.status(201).json(populatedProject);
  } catch (error) {
    if (req.file) {
      await fs.unlink(path.join(resourcesFolder, req.file.filename));
    }
    error.message = "error creating project";
    next(error);
  }
};

const editProject = async (req, res, next) => {
  try {
    const imageName = req.file.originalname;
    const imagePath = path.join(resourcesFolder, imageName);
    await fs.rename(path.join(resourcesFolder, req.file.filename), imagePath);

    const image = await fs.readFile(imagePath);

    const imageReference = ref(
      storage,
      `${firebaseDestinationFolder}/${imageName}`
    );
    await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(imageReference);
    const ProjectToUpdate = { ...req.body, preview: imageUrl };
    const updatedProject = await Project.findByIdAndUpdate(
      req.body.id,
      ProjectToUpdate,
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
