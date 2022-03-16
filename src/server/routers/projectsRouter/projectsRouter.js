const express = require("express");
const { validate } = require("express-validation");
const {
  getAllProjects,
  deleteProject,
  createNewProject,
} = require("../../controllers/projectsControllers/projectsControllers");
const {
  createProjectValidator,
} = require("../../middlewares/validators/projectValidators");

const router = express.Router();

router.get("/all", getAllProjects);
router.delete("/delete/:id", deleteProject);
router.post("/new", validate(createProjectValidator), createNewProject);

module.exports = router;
