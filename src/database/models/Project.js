const { model } = require("mongoose");
const ProjectSchema = require("../schemas/ProjectSchema");

const Project = model("project", ProjectSchema, "projects");

module.exports = Project;
