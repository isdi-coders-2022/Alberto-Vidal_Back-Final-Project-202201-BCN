/* eslint-disable no-param-reassign */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
} = require("firebase/storage");
const { initializeApp } = require("@firebase/app");
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

const firebaseConfig = {
  apiKey: "AIzaSyDb5HJ-t1BUkT4KC7rIUis72YuDbD-w8Wk",
  authDomain: "projectsnap-47388.firebaseapp.com",
  projectId: "projectsnap-47388",
  storageBucket: "projectsnap-47388.appspot.com",
  messagingSenderId: "326750537675",
  appId: "1:326750537675:web:333abd16eab2c3819e184e",
};

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);

const createNewProject = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      const imageOldName = path.join("uploads", req.file.filename);
      const imageName = path.join("uploads", req.file.originalname);
      fs.rename(imageOldName, imageName, (error) => {
        if (error) {
          error.message = "error seting image name";
          next(error);
          resolve();
        } else {
          fs.readFile(imageName, async (err, image) => {
            if (err) {
              err.message = "unable to read image";
              next(err);
              resolve();
            } else {
              const projectReference = ref(
                storage,
                `previews/${req.file.originalname}`
              );
              await uploadBytes(projectReference, image);
              const imageUrl = await getDownloadURL(projectReference);
              const newProject = req.body;
              const newProjectCreated = await Project.create({
                ...newProject,
                preview: imageUrl,
              });
              const populatedProject = await newProjectCreated.populate(
                "author",
                "username avatar id"
              );
              res.status(201).json(populatedProject);
              resolve();
            }
          });
        }
      });
    } catch (error) {
      if (req.file) {
        fs.unlink(path.join("uploads", req.file.filename));
      }
      error.message = "error creating project";
      next(error);
      resolve();
    }
  });

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
