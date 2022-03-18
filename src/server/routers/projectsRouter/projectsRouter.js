const express = require("express");
const { validate } = require("express-validation");
const Project = require("../../../database/models/Project");
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
router.put("/edit", async (req, res, next) => {
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
});

module.exports = router;
