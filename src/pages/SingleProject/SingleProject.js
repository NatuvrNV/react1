import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, ListGroup } from "react-bootstrap";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./SingleProject.css";
import { SingleprojectDetail } from "../../utils/constants";
import { Helmet } from "react-helmet"; 
import { FaPlay } from "react-icons/fa";
import { ProjectImages } from "../../utils/constants";

const SingleProject = () => {
  const imageGridRef = useRef(null);

  const handleImageClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index);
  
    // Scroll entire page to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  
    // Optional: Also prevent #products-grid from overriding the scroll
    document.getElementById("product-grid")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  
  const navigate = useNavigate();
  
  const { projectName } = useParams();
  const selectedProject = SingleprojectDetail.find(
    (item) => item.name.toLowerCase() === projectName
  );

  const [clickedIndex, setClickedIndex] = useState(null);
  const [contentToRender, setContentToRender] = useState([]);
  const gridRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showElementsDropdown, setShowElementsDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  const categories = Array.from(
    new Set(
      selectedProject.images
        .map((item) =>
          item.split("/")[4] !== "night"
            ? item.split("/")[4].toLowerCase()
            : null
        )
        .filter((item) => item)
    )
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setClickedIndex(null);
      }
      window.scrollTo(0, 0);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [gridRef]);

  const isLastRow = (index) => {
    return (
      index >=
      selectedProject.images.length -
        (selectedProject.images.length % 3 === 0
          ? 3
          : selectedProject.images.length % 3)
    );
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setSelectedCategory(""); // Reset category filter when switching modes
  };

  useEffect(() => {
    const nightImages = selectedProject.images.filter(
      (item) => item.split("/")[4] === "night"
    );
  
    if (darkMode && nightImages.length === 0) {
      setContentToRender([]);
    } else {
      setContentToRender(darkMode ? nightImages : selectedProject.images);
    }
  }, [darkMode, selectedProject.images]);

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? contentToRender.filter((img) => img.includes(selectedCategory))
    : contentToRender;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container main-container">
      <Helmet>
        <title>{selectedProject.Projectname} | {selectedProject.metatittles}</title>
        <meta name="description" content={selectedProject.metadescription} />
        <meta property="og:title" content={selectedProject.metatittles}  />
        <meta property="og:description" content={selectedProject.metadescription} />

  
  {/* ✅ PROJECT SCHEMA FOR AI & SEARCH */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": selectedProject.Projectname,
      "url": `https://metaguise.com/all-projects/${projectName}`,
      "description": selectedProject.metadescription,
      "image": selectedProject.images?.map(
        img => `https://metaguise.com/${img}`
      ),
      "creator": {
        "@type": "Organization",
        "name": "Metaguise",
        "url": "https://metaguise.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Metaguise",
        "logo": {
          "@type": "ImageObject",
          "url": "https://metaguise.com/logo.png"
        }
      },
      "keywords": selectedProject.tags || [
        "metal facade",
        "parametric architecture",
        "architectural cladding",
        "custom metal design"
      ],
      "inLanguage": "en-IN"
    })}
  </script>
      </Helmet>
      <div className="row">
        <div className="col-12">
          <BackButton navigate={navigate} />
          {isMobile && (
            <MobileControls
              selectedProject={selectedProject}
              showElementsDropdown={showElementsDropdown}
              setShowElementsDropdown={setShowElementsDropdown}
              filterImagesByCategory={filterImagesByCategory}
              categories={categories}
              showTimeDropdown={showTimeDropdown}
              setShowTimeDropdown={setShowTimeDropdown}
              setDarkMode={setDarkMode}
              selectedCategory={selectedCategory}
              darkMode={darkMode}
            />
          )}
        </div>
        <div className="col-9 xs-12">
          <ImageGrid
            filteredImages={filteredImages}
            handleImageClick={handleImageClick}
            isLastRow={isLastRow}
            clickedIndex={clickedIndex}
            ref={imageGridRef}
            videoLink={selectedProject.videoLink}
            darkMode={darkMode}
            selectedProject={projectName}
            setDarkMode={setDarkMode}
          />
        </div>
        <Sidebar
          selectedProject={selectedProject}
          categories={categories}
          selectedCategory={selectedCategory}
          filterImagesByCategory={filterImagesByCategory}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
          youtubeLink={selectedProject.youtubeLink}
          instagramLink={selectedProject.instagramLink}
        />
        {isMobile && <BuildButton />}
      </div>
      <Footer />
    </div>
  );
};

const BackButton = ({ navigate }) => {
  return (
    <button onClick={() => navigate('/all-projects')} className="back-button">
      <span className="arrow">&larr; Back</span>
    </button>
  );
};

const MobileControls = ({
  selectedProject,
  showElementsDropdown,
  setShowElementsDropdown,
  filterImagesByCategory,
  categories,
  showTimeDropdown,
  setShowTimeDropdown,
  setDarkMode,
  selectedCategory,
  darkMode,
}) => {
  return (
    <div className="mobile-controls">
      <ProjectHeader selectedProject={selectedProject} />
      <div className="Elements">
        <ElementsDropdown
          showElementsDropdown={showElementsDropdown}
          setShowElementsDropdown={setShowElementsDropdown}
          filterImagesByCategory={filterImagesByCategory}
          categories={categories}
          selectedCategory={selectedCategory}
          darkMode={darkMode}
        />
        <TimeDropdown
          showTimeDropdown={showTimeDropdown}
          setShowTimeDropdown={setShowTimeDropdown}
          setDarkMode={setDarkMode}
        />
        <SocialIcons
          youtubeLink={selectedProject?.youtubeLink}
          instagramLink={selectedProject?.instagramLink}
        />
      </div>
    </div>
  );
};

const ProjectHeader = ({ selectedProject }) => {
  return (
    <div className="col-12 single-head mb-3 px-3">
      <h3>
        {selectedProject?.Projectname
          ? selectedProject.Projectname.charAt(0).toUpperCase() +
            selectedProject.Projectname.slice(1)
          : "Project"}
      </h3>
    </div>
  );
};

const ElementsDropdown = ({
  showElementsDropdown,
  setShowElementsDropdown,
  filterImagesByCategory,
  categories,
  selectedCategory,
  darkMode,
}) => {
  return (
    <Dropdown
      show={showElementsDropdown}
      onToggle={(isOpen) => setShowElementsDropdown(isOpen)}
      className="description-dropdown"
    >
      <Dropdown.Toggle variant="dark" id="elements-dropdown">
        Elements
        <div id="arrow-icon" className="icon-overlay">
          <MdArrowOutward size={20} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => filterImagesByCategory("")}
          active={selectedCategory === ""}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          All
          {selectedCategory === "" && <MdArrowOutward size={20} />}
        </Dropdown.Item>
        {!darkMode && categories.map((category, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => filterImagesByCategory(category)}
            active={selectedCategory === category}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {category}
            {selectedCategory === category && <MdArrowOutward size={20} />}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const TimeDropdown = ({ showTimeDropdown, setShowTimeDropdown, setDarkMode }) => {
  return (
    <Dropdown
      show={showTimeDropdown}
      onToggle={(isOpen) => setShowTimeDropdown(isOpen)}
      className="description-dropdown"
    >
      <Dropdown.Toggle variant="dark" id="time-dropdown">
        Time
        <div id="arrow-icon" className="icon-overlay">
          <MdArrowOutward size={20} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setDarkMode(false)}>
          <span className="d-flex align-items-center">
            <FaSun className="me-2" />
            <span>Day</span>
          </span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setDarkMode(true)}>
          <span className="d-flex align-items-center">
            <FaMoon className="me-2" />
            <span>Night</span>
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const SocialIcons = ({ youtubeLink, instagramLink }) => {
  return (
    <div className="social-icons">
      <button
        className="icon-button"
        onClick={() => instagramLink && window.open(instagramLink, "_blank")}
        disabled={!instagramLink}
      >
        <FaInstagram />
      </button>

      <button
        className="icon-button"
        onClick={() => youtubeLink && window.open(youtubeLink, "_blank")}
        disabled={!youtubeLink}
      >
        <FaYoutube />
      </button>
    </div>
  );
};

const Sidebar = ({
  selectedProject,
  categories,
  selectedCategory,
  filterImagesByCategory,
  darkMode,
  toggleTheme,
  activeButton,
  handleButtonClick,
  youtubeLink,
  instagramLink,
}) => {
  return (
    <div className="col-md-3 col-sm-12 sidebar-section pe-md-4 ">
      <h3 style={{ fontWeight: "bold" }}>
        {selectedProject.Projectname.charAt(0).toUpperCase() +
          selectedProject.Projectname.slice(1)}
      </h3>
      <div
        id="single-sidebar"
        className="sidebar p-4 bg-darkrounded "
        style={{ marginBottom: "10px" }}
      >
        <h4 className="mb-3"> Filter by Products</h4>
        
        <ListGroup variant="flush">
          <ListGroup.Item
            action
            variant="dark"
            className={selectedCategory === "" ? "highlight" : "dim"}
            onClick={() => filterImagesByCategory("")}
            active={selectedCategory === ""}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            All
            {selectedCategory === "" && <MdArrowOutward size={20} />}
          </ListGroup.Item>
          {!darkMode && categories.map((category, index) => (
            <ListGroup.Item
              key={index}
              action
              variant="light"
              className={selectedCategory === category ? "highlight" : "dim"}
              onClick={() => filterImagesByCategory(category)}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {selectedCategory === category && <MdArrowOutward size={20} />}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <div className="header-container">
          <p className="time-text">Time</p>
          <div
            className={`switch ${darkMode ? "active" : ""}`}
            onClick={toggleTheme}
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span className="slider">
              <FaSun className="icon sun" />
              <FaMoon className="icon moon" />
            </span>
          </div>
        </div>
      </div>
      <div className="button-row" style={{ padding: "5px" }}>
        <Button
          icon={<FaYoutube />}
          text="See on YouTube"
          onClick={() => window.open(youtubeLink, "_blank")}
          active={activeButton === 0}
        />
        <Button
          icon={<FaInstagram />}
          text="See on Instagram"
          onClick={() => window.open(instagramLink, "_blank")}
          active={activeButton === 1}
        />
      </div>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaY_AV6AaLgq4i2maOVBHN06Ou6PMrqaw9GdissjRbQa57VtkuRdhb2B47c_aem_5oXOIfcz7M1mEeOrTpC1bw">
        <button id="build-button" className="hover-button">
          <span>Build Your Dream</span>
        </button>
      </a>
    </div>
  );
};

const ImageGrid = ({
  filteredImages,
  handleImageClick,
  isLastRow,
  clickedIndex,
  ref,
  videoLink,
  darkMode,
  selectedProject,
  setDarkMode,
}) => {
  const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/gi, '');

  const coverImage = ProjectImages.find(
    (img) => normalizeName(img.imgPath).includes(normalizeName(selectedProject))
  );

  const handleGoBackToDay = () => {
    setDarkMode(false);
  };

  return (
    <div id="product-grid" className="image-grid" ref={ref}>
      {filteredImages.length === 0 ? (
        <div className="no-images-found">
          No images found.
          <span onClick={handleGoBackToDay} style={{ cursor: 'pointer' }}>
            Go Back to Day
          </span>
        </div>
      ) : (
        <>
          {!darkMode && videoLink && (
            <VideoItem
              videoUrl={videoLink}
              index={0}
              handleImageClick={handleImageClick}
              clickedIndex={clickedIndex}
              altText={selectedProject.alt}
            />
          )}

          {coverImage && (
            <Image
              key={`cover-${selectedProject}`}
              image={coverImage.imgPath}
              handleImageClick={handleImageClick}
              isLastRow={isLastRow}
              clickedIndex={clickedIndex}
              altText={selectedProject.alt} 
            />
          )}

          {filteredImages.map((image, index) => (
            <Image
              key={index + 1}
              image={image}
              index={index + 1}
              handleImageClick={handleImageClick}
              isLastRow={isLastRow}
              clickedIndex={clickedIndex}
              altText={selectedProject.alt}
            />
          ))}
        </>
      )}
    </div>
  );
};

const VideoItem = ({ videoUrl, index, handleImageClick, clickedIndex }) => {
  const getVideoId = (url) => {
    if (url.includes("shorts/")) {
      return url.split("/shorts/")[1]?.split("?")[0];
    } else if (url.includes("v=")) {
      return url.split("v=")[1]?.split("&")[0];
    }
    return null;
  };

  const videoId = getVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div
      className={`grid-item video-thumbnail ${clickedIndex === index ? "active" : ""}`}
      onClick={() => handleImageClick(index)}
    >
      {clickedIndex === index ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube Video Thumbnail"
            className="grid-image"
              alt={altText}
            loading="lazy" 
          />
          <div className="play-icon">
            <FaPlay size={40} color="white" />
          </div>
        </>
      )}
    </div>
  );
};

const Image = ({ image, index, handleImageClick, isLastRow, clickedIndex, altText  }) => {
  return (
    <div
      className={`grid-item ${isLastRow(index) ? "last-row" : ""} ${
        clickedIndex === index ? "active" : ""
      }`}
      onClick={() => handleImageClick(index)}
    >
      <img
        src={`${process.env.PUBLIC_URL}/${image}`}
        className="grid-image"
        alt={altText}
        loading="lazy" 
      />
    </div>
  );
};

const Button = ({ icon, text, onClick, active }) => {
  return (
    <button
      className={`transition-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

const BuildButton = () => {
  return (
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaY_AV6AaLgq4i2maOVBHN06Ou6PMrqaw9GdissjRbQa57VtkuRdhb2B47c_aem_5oXOIfcz7M1mEeOrTpC1bw">
      <button id="build-button" className="mobile-controls hover-button">
        <span>Build Your Dream</span>
      </button>
    </a>
  );
};

export default SingleProject;
