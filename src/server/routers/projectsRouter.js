const express = require("express");
const {
  getAllProjects,
  deleteProject,
} = require("../controllers/projectsControllers");

const router = express.Router();

router.get("/all", getAllProjects);
router.delete("/delete/:id", deleteProject);
router.post("/new");

module.exports = router;
