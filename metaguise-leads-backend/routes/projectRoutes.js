const express = require("express");
const router = express.Router();
const { getAllProjects, updateProject } = require("../controllers/projectController");

// Routes
router.get("/projects", getAllProjects);
router.put("/projects/:id", updateProject);

module.exports = router;
