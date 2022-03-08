const express = require("express");
const { getAllProjects } = require("../controllers/projectsControllers");

const router = express.Router();

router.get("projects", getAllProjects);
