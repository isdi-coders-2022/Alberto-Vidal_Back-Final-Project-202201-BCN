const express = require("express");
const Project = require("../../database/models/Project");

const router = express.Router();

router.get("projects", async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    error.message = "error getting projects";
    next(error);
  }
});
