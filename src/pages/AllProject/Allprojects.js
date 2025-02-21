import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, ListGroup, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./Allprojects.css";
import { SingleprojectDetail } from "../../utils/constants";
import { ProjectImages as images } from "../../utils/constants";
import { Helmet } from "react-helmet-async";

const Allprojects = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const projectClickHandler = (img) => {
    const selectedSubProjectCat = img.imgPath.split("/")[3].toLowerCase();
    const selectedProject = SingleprojectDetail.find(
      (item) => item.name.toLowerCase() === selectedSubProjectCat
    );
    navigate(`/all-projects/${selectedSubProjectCat}`, { state: { selectedProject } }); // Redirect to SingleProject page with dynamic URL
  };

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? images.filter((img) =>
        img.imgPath.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : images;

  const location = useLocation();

  useEffect(() => {
    const handleScrollBehavior = () => {
      const isMobile = window.innerWidth <= 768;
      if (location.pathname === "/all-projects" && !isMobile) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "auto";
      }
    };

    handleScrollBehavior();

    window.addEventListener("resize", handleScrollBehavior);

    return () => {
      document.body.style.overflowY = "auto";
      window.removeEventListener("resize", handleScrollBehavior);
    };
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="gallery-container">
            <Helmet>
                          <title>Metaguise Projects | Iconic Metal Facades & Architectural Marvels</title>
                          <meta name="description" content="Discover Metaguise’s portfolio of transformative metal facades and architectural projects, showcasing innovation, precision, and design master" />
                          <meta name="keywords" content="home, react, SEO, web development" />
                          <meta name="author" content="Your Name" />
                          <meta property="og:title" content="Metaguise Projects | Iconic Metal Facades & Architectural Marvels" />
                          <meta property="og:description" content="Discover Metaguise’s portfolio of transformative metal facades and architectural projects, showcasing innovation, precision, and design master" />
                          <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />
                          <meta property="og:url" content="https://yourwebsite.com/" />
                          <meta name="robots" content="index, follow" />
                        </Helmet>
      <div className="gallery-content">
        <Container fluid>
          <Row>
            <div className="mobile-title">
              <h1>Our Projects</h1>
            </div>
            <Col lg={9} md={8}>
              {isMobile && (
                <div className="mobile-filter">
                  <Dropdown
                    show={showDropdown}
                    onToggle={(isOpen) => setShowDropdown(isOpen)}
                  >
                    <Dropdown.Toggle variant="dark" id="type-dropdown">
                      Filter by Type
                      <div id="arrow-icon" className="icon-overlay">
                        <MdArrowOutward size={20} />
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
  <Dropdown.Item
    onClick={() => filterImagesByCategory("")}
    active={selectedCategory === ""}
  >
    <div className="d-flex justify-content-between align-items-center">
    All
    {selectedCategory === "" && <MdArrowOutward className="dropdown-arrow" />}
    </div>
   
  </Dropdown.Item>
  <Dropdown.Item
    onClick={() => filterImagesByCategory("residential")}
    active={selectedCategory === "residential"}
  >
    <div className="d-flex justify-content-between align-items-center">
    Residential
    {selectedCategory === "residential" && <MdArrowOutward className="dropdown-arrow" />}
    </div>
 
  </Dropdown.Item>
  <Dropdown.Item
    onClick={() => filterImagesByCategory("commercial")}
    active={selectedCategory === "commercial"}
  >
    <div className="d-flex justify-content-between align-items-center">
    Commercial
    {selectedCategory === "commercial" && <MdArrowOutward className="dropdown-arrow" />}
    </div>
   
  </Dropdown.Item>
</Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
              <div className="gallery">
                {filteredImages.map((img, index) => (
                  <div
                    key={index}
                    className="gallery-item"
                    onClick={() => projectClickHandler(img)}
                  >
                    <div className="hover-effect">
                      <img
                        src={`${process.env.PUBLIC_URL}/${img.imgPath}`}
                        alt={`Gallery ${index}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={2} md={4} className="mb-4">
              <h1 className="desktop-title mb-3">Our Projects</h1>
              <div className="sidebar">
                <h4 className="mb-3"> Filter by Type</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item
                    action
                    variant="dark"
                    className={selectedCategory === "" ? "highlight" : "dim"}
                    onClick={() => filterImagesByCategory("")}
                  >
                    <div className="d-flex justify-content-between align-items-center">
      All
      {selectedCategory === "" && <MdArrowOutward className="sidebar-arrow" />}
    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    variant="dark"
                    className={
                      selectedCategory === "residential" ? "highlight" : "dim"
                    }
                    onClick={() => filterImagesByCategory("residential")}
                  >
                   <div className="d-flex justify-content-between align-items-center">
      Residential
      {selectedCategory === "residential" && <MdArrowOutward className="sidebar-arrow" />}
    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    variant="dark"
                    className={
                      selectedCategory === "commercial" ? "highlight" : "dim"
                    }
                    onClick={() => filterImagesByCategory("commercial")}
                  >
                      <div className="d-flex justify-content-between align-items-center">
      Commercial
      {selectedCategory === "commercial" && <MdArrowOutward className="sidebar-arrow" />}
    </div>
                  </ListGroup.Item>
                </ListGroup>
              </div>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaabIioPAYAnCxDaY2hFZjSf7qeU9qJGc_DuYZxtxI_G_nWUTiefpS62FNo_aem_KRmg-CrKFIxQiXf9Mtglow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button id="build-button" className="hover-button">
                  <span>Build Your Dream</span>
                </button>
              </a>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Allprojects;