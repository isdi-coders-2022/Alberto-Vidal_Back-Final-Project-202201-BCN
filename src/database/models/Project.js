const { model } = require("mongoose");
const ProjectSchema = require("../schemas/ProjectSchema");

const Project = model("Project", ProjectSchema, "projects");

module.exports = Project;
