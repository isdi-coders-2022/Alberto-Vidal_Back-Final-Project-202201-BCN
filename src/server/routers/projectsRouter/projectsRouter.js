const express = require("express");
const { validate } = require("express-validation");
const {
  getAllProjects,
  deleteProject,
  createNewProject,
  editProject,
} = require("../../controllers/projectsControllers/projectsControllers");
const {
  createProjectValidator,
  editProjectValidator,
} = require("../../middlewares/validators/projectValidators");

const router = express.Router();

router.get("/all", getAllProjects);
router.delete("/delete/:id", deleteProject);
router.post("/new", validate(createProjectValidator), createNewProject);
router.put("/edit", validate(editProjectValidator), editProject);

module.exports = router;
