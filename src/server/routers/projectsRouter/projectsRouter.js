const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");

const upload = multer({ dest: "uploads/", limits: { fileSize: 1331133 } });

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
router.post(
  "/new",
  upload.single("preview"),
  validate(createProjectValidator),
  createNewProject
);
router.put(
  "/edit",
  upload.single("preview"),
  validate(editProjectValidator),
  editProject
);

module.exports = router;
