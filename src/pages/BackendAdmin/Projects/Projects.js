import React, { useEffect, useState } from "react";
import "./Projects.css";
import { MdDelete, MdEdit, MdSave, MdClose } from "react-icons/md";
import { SingleprojectDetail, ProjectImages } from "../../../utils/constants";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProject, setEditedProject] = useState({});

  useEffect(() => {
    const projectsWithImages = SingleprojectDetail.map((project) => {
      const coverImage = ProjectImages.find((img) =>
        new RegExp(`\\b${project.name}\\b`, "i").test(img.imgPath)
      )?.imgPath || "";

      const type = coverImage.split("/")[2]; // Extract 'commercial' or 'residential' from the path
      return { ...project, coverImage, type };
    });
    setProjects(projectsWithImages);
  }, []);

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setEditedProject(project);
  };

  const handleChange = (e, field) => {
    setEditedProject({ ...editedProject, [field]: e.target.value });
  };

  const handleSave = (id) => {
    const updatedProjects = projects.map((project) =>
      project._id === id ? editedProject : project
    );
    setProjects(updatedProjects);
    setEditingProjectId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const filteredProjects = projects.filter((project) => project._id !== id);
      setProjects(filteredProjects);
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar-admin">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
          <li><a href="/admin">Leads</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/products">Products</a></li>
            <li>
              <button className="logout-button" onClick={() => window.location.href = "/login"}>Logout</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-navbar">
          <h1>Projects Management</h1>
        </header>

        {/* Projects Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Project Name</th>
                <th>Type</th>
                <th>Cover Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id}>
                    {editingProjectId === project._id ? (
                      <>
                        <td>
                          <input
                            className="updateProject"
                            value={editedProject.name}
                            onChange={(e) => handleChange(e, "name")}
                          />
                        </td>
                        <td>
                          <input
                            className="updateProject"
                            value={editedProject.Projectname}
                            onChange={(e) => handleChange(e, "Projectname")}
                          />
                        </td>
                        <td>{project.type}</td>
                        <td>{project.coverImage && <img src={project.coverImage} alt="Cover" className="cover-image" />}</td>
                        <td>
                          <button onClick={() => handleSave(project._id)}><MdSave size={20} /></button>
                          <button onClick={() => setEditingProjectId(null)}><MdClose size={20} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{project.name}</td>
                        <td>{project.Projectname}</td>
                        <td>{project.type}</td>
                        <td className="image-table">{project.coverImage && <img src={project.coverImage} alt="Cover" className="cover-image" />}</td>
                        <td>
                          <button onClick={() => handleEdit(project)}><MdEdit size={20} /></button>
                          <button onClick={() => handleDelete(project._id)}><MdDelete size={20} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Projects;
