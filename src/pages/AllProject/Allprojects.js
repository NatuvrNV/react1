import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, ListGroup, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./Allprojects.css";
// SingleprojectDetail used to be a static import (~213 KB in every bundle).
// The listing page only ever needed name/url/Projectname, so it now fetches
// the lightweight projects index instead.
import { fetchProjectsIndex } from "../../utils/fetchProjectData";
import { ProjectImages as images } from "../../utils/constants";
import { Helmet } from "react-helmet-async";

// Same visually-hidden-but-crawlable pattern used on Contact.js/Partner.js.
// NOT display:none, which Google discounts — this keeps the content in the
// accessibility tree and readable by crawlers while invisible to sighted
// visitors, per explicit request.
const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

const Allprojects = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Lightweight index (name, url, Projectname, meta only) — replaces the
  // old full-detail SingleprojectDetail static import.
  const [projectsIndex, setProjectsIndex] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchProjectsIndex()
      .then((data) => {
        if (!cancelled) setProjectsIndex(data);
      })
      .catch(() => {
        if (!cancelled) setProjectsIndex([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

const projectClickHandler = (img) => {
  const selectedSubProjectCat = img.imgPath.split("/")[3].toLowerCase();
  const selectedProject = projectsIndex.find(
    (item) => item.name.toLowerCase() === selectedSubProjectCat
  );

  // Use the url field from the project for navigation
  if (selectedProject && selectedProject.url) {
    navigate(`/all-projects/${selectedProject.url}/`, { state: { selectedProject } });
  } else {
    // Fallback to the old method if url doesn't exist
    navigate(`/all-projects/${selectedSubProjectCat}/`, { state: { selectedProject } });
  }
};

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? images.filter((img) =>
        img.imgPath.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : images;

  // ✅ Task 2 fix — get project name and url from the projects index, but
  // fall back to the real folder name from imgPath (e.g. "Miraj Stadium")
  // instead of the literal string "Project". The folder name is already
  // baked into constants.js and available synchronously on first render,
  // so cards show real names immediately even before projectsIndex loads
  // (or if that fetch is slow/fails) — this is what was causing names to
  // disappear from the rendered DOM.
  const getProjectInfo = (imgPath) => {
    const imgName = imgPath.split("/")[3].toLowerCase();
    const folderName = imgPath.split("/")[3]; // e.g. "Miraj Stadium" — already readable
    const project = projectsIndex.find(
      (item) => item.name.toLowerCase() === imgName
    );
    return {
      name: project ? project.Projectname : folderName,
      url: project?.url || imgName // Use url if available, fallback to imgName
    };
  };

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

  // BreadcrumbList schema — task #2. This is the projects INDEX page, so
  // it's only two levels deep (Home > Projects). The three-level version
  // (Home > Projects > Miraj Stadium) belongs on the individual project
  // page (SingleProject.js), which already has it. Last item omits "item"
  // (no URL), per Google's guidance for the current page in a breadcrumb trail.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://metaguise.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Projects"
      }
    ]
  };

  return (
    <div className="gallery-container">
      <Helmet>
        <title>Metal Facade Projects Portfolio India | 1800+ Projects | Metaguise</title>
        <meta name="description" content="Browse 1800+ completed metal facade and parametric architecture projects by Metaguise. Residential, commercial and institutional buildings across India." />
        <meta name="keywords" content="metal facade projects, facade portfolio india, kinetic facade project" />
        <meta name="author" content="Your Name" />
        <meta property="og:title" content="Metal Facade Projects Portfolio India | 1800+ Projects | Metaguise" />
        <meta property="og:description" content="Browse 1800+ completed metal facade and parametric architecture projects by Metaguise. Residential, commercial and institutional buildings across India." />
        <meta property="og:image" content="https://metaguise.com/home-image.jpg" />
        <meta property="og:url" content="https://metaguise.com/all-projects/" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/all-projects/" />

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <div className="gallery-content">
        <Container fluid>
          <Row>
            {/* FIX (Yash task 3): this used to be a second <h1>, duplicating
                the one in the desktop sidebar below. Both exist in the DOM
                at once — CSS only ever hides one visually, so Google still
                counted two H1s on this page. Downgraded to <h2>; the
                desktop-title one remains the page's single real <h1>. The
                CSS class is unchanged so it still looks identical on mobile. */}
            <div className="mobile-title">
              <h2>Our Projects</h2>
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
                {filteredImages.map((img, index) => {
                  const projectInfo = getProjectInfo(img.imgPath);
                  return (
                    <div
                      key={index}
                      className="gallery-item"
                      onClick={() => projectClickHandler(img)}
                    >
                      <div className="hover-effect">
                        {/* ✅ Task 2 — real name-based alt text (falls back to
                            constants.js per-image alt if present), and
                            width/height to prevent layout shift (Task 10) */}
                        <img
                          src={`${process.env.PUBLIC_URL}/${img.imgPath}`}
                          alt={img.alt || `${projectInfo.name} facade by Metaguise`}
                          width={640}
                          height={480}
                          loading="lazy"
                        />
                      </div>
                      {/* ✅ Task 2 — real heading instead of a bare div, so the
                          project name is real, semantic text in the DOM */}
                      <h3 className="image-text">{projectInfo.name}</h3>
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col lg={2} md={4} className="mb-4">
              {/* This is now the page's single H1. Unchanged. */}
              <h1 className="desktop-title mb-3">Our Projects</h1>
              <div className="sidebar">
                <h4 className="mb-3">Filter by Type</h4>
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
              <a href="/build/">
                <button id="build-button" className="hover-button">
                  <span>Build Your Dream</span>
                </button>
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/*
        ⚠️ NOTE: same technique as Contact.js/Partner.js — this section is
        visually hidden via srOnlyStyle so crawlers read it but visitors
        never see it. Heading downgraded to H2, not H1, to stay consistent
        with the task 3 fix on this exact page (a second H1 was already
        removed here once — a hidden H1 would reopen that same issue since
        Google counts H1 tags regardless of CSS visibility).
      */}
      <Container as="section" className="projects-copy py-5" style={srOnlyStyle}>
        <Row>
          <Col lg={8} className="mx-auto">
            <h2>1,800+ Metal Facade Projects Across India</h2>
            <p>
              Explore Metaguise's portfolio of metal facade and elevation
              projects across India - from luxury residences to commercial
              towers, hospitals, jewellery showrooms, and public and
              institutional landmarks. Every project features a custom
              facade system engineered for the client's climate, budget, and
              architectural vision.
            </p>

            <h2>Residential Facade Projects</h2>
            <p>
              Luxury villas, bungalows, builder floors, and duplexes
              featuring parametric, perforated, kinetic, and solid panel
              metal facades designed for privacy, light control, and street
              presence.
            </p>

            <h2>Commercial &amp; Retail Facade Projects</h2>
            <p>
              Office buildings, showrooms, and retail storefronts using
              metal cladding to create brand-forward, high-visibility
              elevations.
            </p>

            <h2>Institutional Facade Projects</h2>
            <p>
              Hospitals, universities, stadiums, banks, and public buildings
              where facade design balances safety, durability, and
              architectural identity at scale.
            </p>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Allprojects;