import { React, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { FaYoutube, FaInstagram, FaCube } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SingleProject.css";

const SingleProject = () => {
  const location = useLocation();
  const { selectedProject } = location.state || {};

  const [clickedIndex, setClickedIndex] = useState(null);
  const [contentToRender, setContentToRender] = useState([]);
  const gridRef = useRef(null);

  const handleImageClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setClickedIndex(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const isLastRow = (index) => {
    return (
      index >=
      selectedProject.images.length -
        (selectedProject.images.length % 3 === 0
          ? 3
          : selectedProject.images.length % 3)
    );
  };

  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    setContentToRender(
      darkMode
        ? selectedProject.images.filter(
            (item) => item.split("/")[4] === "night"
          )
        : selectedProject.images
    );
  }, [darkMode, selectedProject.images]); // Runs every time darkMode or images update

  const navigate = useNavigate();
  return (
    <div className="container main-container">
      <div className="row">
        <div claassName="col-12">
          <button onClick={() => navigate(-1)} className="back-button">
            <span className="arrow">&larr; Back</span>
          </button>
        </div>
        {/* Gallery Section occupying col-9 */}
        <div className="col-9 xs-12">
          <div className="image-grid">
            {contentToRender.map((image, index) => (
              <div
                key={index}
                className={`grid-item ${isLastRow(index) ? "last-row" : ""} ${
                  clickedIndex === index ? "active" : ""
                }`}
                onClick={() => {
                  handleImageClick(index);
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${image}`}
                  className="grid-image"
                  alt="Project gallery item"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Empty Space col-2 */}
        <div className="col-md-3 col-sm-12 sidebar-section">
          <h3 style={{ fontWeight: "bold" }}>Metacoin</h3>
          <div
            className="sidebar p-4 bg-darkrounded"
            style={{ marginBottom: "10px" }}
          >
            <ListGroup variant="flush">
              {/* <ListGroup.Item action variant="dark" style={{color: "#fff"}}>Section</ListGroup.Item> */}
              <ListGroup.Item
                action
                variant="dark"
                className={selectedCategory === "" ? "highlight" : "dim"}
                onClick={() => filterImagesByCategory("")}
              >
                All
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === " Metasequin" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory(" Metasequin")}
              >
                Metasequin
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "  MetaFin" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("  MetaFin")}
              >
                MetaFin
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === " Metacassette" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory(" Metacassette")}
              >
                Metacassette
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metapyramid" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Metapyramid")}
              >
                Metapyramid
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metacassette Perforated"
                    ? "highlight"
                    : "dim"
                }
                onClick={() =>
                  filterImagesByCategory("Metacassette Perforated")
                }
              >
                Metacassette Perforated
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metaflute" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Metaflute")}
              >
                Metaflute
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metacassette Grooved"
                    ? "highlight"
                    : "dim"
                }
                onClick={() => filterImagesByCategory("Metacassette Grooved")}
              >
                Metacassette Grooved
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === " Metalouver" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory(" Metalouver")}
              >
                Metalouver
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === " Metaplank" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory(" Metaplank")}
              >
                Metaplank
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metapyramid" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Metapyramid")}
              >
                Metapyramid
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metashingle" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Metashingle")}
              >
                Metashingle
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === " Metafold" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory(" Metafold")}
              >
                Metafold
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Solid Panel" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Solid Panel")}
              >
                Solid Panel
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "metalouver Grey" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("metalouver Grey")}
              >
                metalouver Grey
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "metalouver Wood" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("metalouver Wood")}
              >
                metalouver Wood
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Metagate" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Metagate")}
              >
                Metagate
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className={darkMode ? "dark-mode" : "light-mode"}>
            <div className="header-container">
              <p className="time-text">Time</p>
              <button className="toggle-button" onClick={toggleTheme}>
                {darkMode ? (
                  <FaMoon className="icon" />
                ) : (
                  <FaSun className="icon" />
                )}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <button className="transition-button">
                <span className="icon">
                  <FaYoutube />
                </span>
                <span className="text">
                  <span className="icon">
                    <FaYoutube />
                  </span>
                  See on YouTube
                </span>
              </button>
            </div>
            <div className="col-md-4">
              <button className="transition-button">
                <span className="icon">
                  <FaInstagram />
                </span>
                <span className="text">
                  <span className="icon">
                    <FaInstagram />
                  </span>
                  See on Instagram
                </span>
              </button>
            </div>
            <div className="col-md-4">
              <button className="transition-button">
                <span className="icon">
                  <FaCube />
                </span>
                <span className="text">
                  <span className="icon">
                    <FaCube />
                  </span>
                  Explore AR
                </span>
              </button>
            </div>
          </div>
          <button className="hover-button">
            <span>Build Your Dream</span>
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default SingleProject;
