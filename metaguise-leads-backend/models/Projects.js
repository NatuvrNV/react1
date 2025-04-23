const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectname: { type: String, required: true },
  coverImage: { type: String },  // Add if needed for cover images
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
