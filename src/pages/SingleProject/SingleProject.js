import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./SingleProject.css";
// SingleprojectDetail used to be a static import (~213 KB in every bundle).
// It's now fetched on demand from /data/projects/<slug>.json.
import { ProjectImages } from "../../utils/constants";
import { fetchProjectBySlug, fetchProjectsIndex } from "../../utils/fetchProjectData";
import { Helmet } from "react-helmet-async";
import { FaPlay } from "react-icons/fa";

const SingleProject = () => {
  const navigate = useNavigate();
  const { projectName } = useParams();

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURN
  const [contentToRender, setContentToRender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showElementsDropdown, setShowElementsDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  // Project data now comes from a fetch, not a static import
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Project copy data (h1 / definitionParagraph / h2Sections) is loaded
  // from projects-index.json, same pattern as SingleProduct.js.
  const [projectCopyData, setProjectCopyData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.PUBLIC_URL}/data/projects-index.json`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) {
          setProjectCopyData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjectCopyData([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // projects-index.json is a list (not a slug-keyed object like
  // products-index.json), so match the current project by its url slug.
  const projectCopy =
    (Array.isArray(projectCopyData) &&
      projectCopyData.find(
        (item) => item.url?.toLowerCase() === project?.url?.toLowerCase()
      )) ||
    null;

  // Full definitionParagraph, shown below the carousel. h2Sections still
  // stay hidden-for-SEO only (see SeoContent below).
  const projectDefinition = projectCopy?.definitionParagraph || null;

  // Detail rows shown in the sidebar card. All optional: a row only renders
  // when its value exists. Read from the per-project JSON first, then
  // projects-index.json. `products` falls back to the folder-derived
  // categories (metacoin, metacryst, ...) when not set.
  const projectDetails = {
    location: project?.location || projectCopy?.location || null,
    type: project?.projectType || projectCopy?.projectType || null,
    products:
      project?.products || projectCopy?.products || null,
  };

  // Fetch the project by URL slug. Falls back to searching by name (for old-format
  // links) using the lightweight index, then redirects to the canonical URL.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    setProject(null);

    const slug = projectName?.toLowerCase();

    fetchProjectBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setProject(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        fetchProjectsIndex()
          .then((index) => {
            const match = index.find(
              (item) => item.name?.toLowerCase().replace(/\s+/g, "-") === slug
            );
            if (!match) {
              if (!cancelled) {
                setNotFound(true);
                setIsLoading(false);
              }
              return;
            }
            if (!cancelled) {
              navigate(`/all-projects/${match.url}/`, { replace: true });
            }
          })
          .catch(() => {
            if (!cancelled) {
              setNotFound(true);
              setIsLoading(false);
            }
          });
      });

    return () => {
      cancelled = true;
    };
  }, [projectName, navigate]);

  const generateMetaKeywords = () => {
    const baseKeywords = [
      "metal facade",
      "metal cladding",
      "architectural metal",
      "parametric facade",
      "Metaguise",
      "facade project",
      "architectural project"
    ];

    const projectSpecificKeywords = project?.metaKeywords || [
      project?.Projectname,
      `${project?.Projectname} metal facade`,
      `${project?.Projectname} architectural project`,
      `${project?.Projectname} cladding design`,
      "premium metal facade project",
      "luxury facade design",
      "architectural metal installation",
      "facade project India",
      "custom metal facade project",
      "parametric architecture project"
    ];

    return [...baseKeywords, ...projectSpecificKeywords].join(", ");
  };

  const getProjectOgImage = () => {
    if (project?.images && project.images.length > 0) {
      const firstImage = typeof project.images[0] === 'string' ? project.images[0] : project.images[0].src;
      return `https://metaguise.com/${firstImage}`;
    }

    const normalizeName = (name) => name?.toLowerCase().replace(/[^a-z0-9]/gi, '') || '';
    const coverImage = ProjectImages?.find(
      (img) => normalizeName(img.imgPath).includes(normalizeName(project?.name))
    );

    if (coverImage) {
      return `https://metaguise.com/${coverImage.imgPath}`;
    }

    return "https://metaguise.com/default-project-image.jpg";
  };

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  const categories = Array.from(
    new Set(
      project?.images
        ?.map((item) => {
          const path = typeof item === 'string' ? item : item.src;
          return path.split("/")[4] !== "night"
            ? path.split("/")[4]?.toLowerCase()
            : null;
        })
        .filter((item) => item) || []
    )
  );

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setSelectedCategory("");
  };

  useEffect(() => {
    if (!project) return;

    const nightImages = project.images?.filter((item) => {
      const path = typeof item === 'string' ? item : item.src;
      return path.split("/")[4] === "night";
    }) || [];

    if (darkMode && nightImages.length === 0) {
      setContentToRender([]);
    } else {
      setContentToRender(darkMode ? nightImages : project.images || []);
    }
  }, [darkMode, project?.images]);

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? contentToRender.filter((img) => {
        const path = typeof img === 'string' ? img : img.src;
        return path.includes(selectedCategory);
      })
    : contentToRender;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Now the conditional returns (after all hooks)
  if (isLoading) {
    return (
      <div className="container main-container single-project-page">
        <div className="row">
          <div className="col-12 text-center py-5">
            <p>Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="container main-container single-project-page">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h2>Project not found</h2>
            <button
              onClick={() => navigate("/all-projects/")}
              className="back-button mt-3"
            >
              <span className="arrow">&larr; Back to Projects</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.Projectname,
    "url": `https://metaguise.com/all-projects/${project.url}/`,
    "description": project.metadescription || project.description || `Explore ${project.Projectname} - a stunning metal facade project by Metaguise`,
    "image": project.images?.map(img => {
      const src = typeof img === 'string' ? img : img.src;
      return `https://metaguise.com/${src}`;
    }),
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
    "keywords": project.tags || [
      "metal facade",
      "parametric architecture",
      "architectural cladding",
      "custom metal design"
    ],
    "inLanguage": "en-IN"
  };

  // BreadcrumbList schema — task #2. Last item deliberately omits "item"
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
        "name": "Projects",
        "item": "https://metaguise.com/all-projects/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.Projectname
      }
    ]
  };

  // FAQPage schema — sourced from projects-index.json -> projectCopy.faqSchema.
  // Not every project has FAQ content yet, so this is only rendered when present.
  const faqSchema = projectCopy?.faqSchema || null;

  return (
    <div className="container main-container single-project-page">
      <Helmet>
        <title>{project.metatittles || `${project.Projectname} | Premium Metal Facade Project | Metaguise`}</title>
        <meta name="description" content={project.metadescription || project.description || `Explore ${project.Projectname} - a stunning architectural metal facade project by Metaguise, India's leading facade specialist.`} />
        <meta name="keywords" content={generateMetaKeywords()} />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={`https://metaguise.com/all-projects/${project.url}/`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={project.ogTitle || project.metatittles || `${project.Projectname} | Architectural Metal Facade Project | Metaguise`} />
        <meta property="og:description" content={project.ogDescription || project.metadescription || project.description || `Discover ${project.Projectname} - a masterpiece of parametric metal facade design by Metaguise.`} />
        <meta property="og:image" content={project.ogImage || getProjectOgImage()} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${project.Projectname} - Metal facade architectural project by Metaguise`} />
        <meta property="og:url" content={`https://metaguise.com/all-projects/${project.url}/`} />
        <meta property="og:site_name" content="Metaguise" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:published_time" content={project.date || "2024"} />
        <meta property="article:author" content="Metaguise" />
        <meta property="article:section" content="Architectural Projects" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.twitterTitle || project.metatittles || `${project.Projectname} | Metaguise Metal Facade Project`} />
        <meta name="twitter:description" content={project.twitterDescription || project.metadescription || project.description || `Explore ${project.Projectname} - an exceptional metal facade project by Metaguise.`} />
        <meta name="twitter:image" content={project.twitterImage || project.ogImage || getProjectOgImage()} />
        <meta name="twitter:url" content={`https://metaguise.com/all-projects/${project.url}/`} />
        <meta name="twitter:site" content="@metaguise" />
        <meta name="twitter:creator" content="@metaguise" />

        <script type="application/ld+json">
          {JSON.stringify(projectSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="row">
        <div className="col-12">
          <BackButton navigate={navigate} />
          {isMobile && (
            <MobileControls
              selectedProject={project}
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
          <ProjectCarousel
            filteredImages={filteredImages}
            videoLink={project.videoLink}
            darkMode={darkMode}
            selectedProject={project}
            setDarkMode={setDarkMode}
          />
        </div>

        {/* Mobile: show the project description right under the carousel.
            (On desktop it stays in the Sidebar card.) */}
        {isMobile && projectDefinition && (
          <div className="col-12 project-definition-mobile">
            <p className="project-definition-text">{projectDefinition}</p>
          </div>
        )}

        <Sidebar
          selectedProject={project}
          categories={categories}
          selectedCategory={selectedCategory}
          filterImagesByCategory={filterImagesByCategory}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
          youtubeLink={project.youtubeLink}
          instagramLink={project.instagramLink}
          projectSlug={project.url}
          projectDefinition={isMobile ? null : projectDefinition}
          projectDetails={projectDetails}
        />

        {isMobile && <BuildButton projectSlug={project.url} />}
      </div>

      {/*
        SEO content block.
        This is NOT visually shown to regular visitors — it's clipped
        off-screen with the "visually hidden" technique (same pattern
        used for screen-reader-only text), so it stays in the DOM and
        accessibility tree.

        Because the site is served through the Puppeteer prerender
        pipeline, crawlers get the fully rendered HTML (including this
        block), while human visitors only see the visible summary blurb
        (in the sidebar) plus the normal carousel/sidebar UI.

        Source: projects-index.json -> projectCopy (definitionParagraph, h2Sections)
      */}
      {projectCopy && (
        <SeoContent projectCopy={projectCopy} />
      )}

      <Footer />
    </div>
  );
};

// Visually-hidden style: clips content off-screen without display:none
// or visibility:hidden, so it stays in the DOM and accessibility tree
// (and therefore in whatever HTML the Puppeteer prerender snapshot
// serves to crawlers), but is not visible in the normal page layout.
const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

// Renders the full definitionParagraph + h2Sections from projects-index.json.
// Deliberately does NOT render projectCopy.h1 as an <h1> tag — the page
// already has one visible <h1> (the project name, in Sidebar). A second
// <h1> would hurt heading structure rather than help it.
const SeoContent = ({ projectCopy }) => {
  if (!projectCopy) return null;

  const { definitionParagraph, h2Sections } = projectCopy;

  if (!definitionParagraph && !(h2Sections && h2Sections.length)) {
    return null;
  }

  return (
    <div
      className="seo-hidden-content"
      style={visuallyHiddenStyle}
      aria-hidden="false"
    >
      {definitionParagraph && <p>{definitionParagraph}</p>}

      {Array.isArray(h2Sections) &&
        h2Sections.map((section, index) => (
          <section key={index}>
            <h2>{section.heading}</h2>
            <p>{section.copy}</p>
          </section>
        ))}
    </div>
  );
};

const BackButton = ({ navigate }) => {
  return (
    <button onClick={() => navigate('/all-projects/')} className="back-button">
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

// Mobile-only top label — kept as h3, since the true page H1 lives in the
// Sidebar below (that one's always in the DOM regardless of viewport).
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
  projectSlug,
  projectDefinition,
  projectDetails,
}) => {
  const productsText = Array.isArray(projectDetails?.products)
    ? projectDetails.products.join(", ")
    : projectDetails?.products ||
      categories
        .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
        .join(", ");

  const detailRows = [
    { label: "Location", value: projectDetails?.location },
    { label: "Products", value: productsText },
    { label: "Type", value: projectDetails?.type },
  ].filter((row) => row.value);

  return (
    <div className="col-md-3 col-sm-12 sidebar-section pe-md-4 ">
      {/* ✅ Task 3 — real H1. This wrapper is always in the DOM (mobile CSS
          only resizes it, never hides it), so it's safe to be the page's
          single H1 regardless of viewport. Style unchanged — still inline
          fontWeight: "bold", just a different tag. */}
      <h1 style={{ fontWeight: "bold" }}>
        {selectedProject.Projectname.charAt(0).toUpperCase() +
          selectedProject.Projectname.slice(1)}
      </h1>

      {(projectDefinition || detailRows.length > 0) && (
        <div className="project-details-card">
          {projectDefinition && (
            <p className="project-definition-text">{projectDefinition}</p>
          )}
          {detailRows.length > 0 && (
            <dl className="project-detail-rows">
              {detailRows.map((row) => (
                <div className="project-detail-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      <div
        id="single-sidebar"
        className="sidebar p-4 bg-darkrounded "
        style={{ marginBottom: "10px" }}
      >
        <h4 className="mb-3">Filter by Products</h4>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => filterImagesByCategory("")}
          >
            All
          </button>
          {!darkMode &&
            categories.map((category, index) => (
              <button
                key={index}
                type="button"
                className={`filter-pill ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => filterImagesByCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
        </div>
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

      <a href={`/build/?project=${projectSlug}/`}>
        <button id="build-button" className="hover-button">
          <span>Build Your Dream</span>
        </button>
      </a>
    </div>
  );
};

// Builds the ordered slide list (video → cover image → filtered images) and
// renders it as a single-slide carousel with arrows + dots. Category
// filtering and day/night mode are handled upstream — filteredImages
// already reflects both, so the carousel just re-renders when they change.
const ProjectCarousel = ({
  filteredImages,
  videoLink,
  darkMode,
  selectedProject,
  setDarkMode,
}) => {
  const normalizeName = (name) => name?.toLowerCase().replace(/[^a-z0-9]/gi, '') || '';

  const coverImage = ProjectImages?.find(
    (img) => normalizeName(img.imgPath).includes(normalizeName(selectedProject?.name))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const slides = [];

  if (!darkMode && videoLink) {
    slides.push({ type: "video", videoUrl: videoLink });
  }

  if (coverImage) {
    slides.push({
      type: "image",
      src: coverImage.imgPath,
      alt: coverImage.alt || `${selectedProject?.Projectname} - Cover image`,
    });
  }

  filteredImages.forEach((imgObj, idx) => {
    const src = typeof imgObj === "string" ? imgObj : imgObj.src;
    const alt =
      typeof imgObj === "object" && imgObj.alt
        ? imgObj.alt
        : `${selectedProject?.Projectname} - Architectural view ${idx + 1}`;
    slides.push({ type: "image", src, alt });
  });

  // Jump back to the first slide whenever the filter, day/night mode, or
  // video changes the slide set — otherwise currentIndex could point past
  // the end of a shorter filtered list.
  useEffect(() => {
    setCurrentIndex(0);
    setIsVideoPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode, videoLink, filteredImages.length, filteredImages[0]]);

  const getVideoId = (url) => {
    if (!url) return null;
    if (url.includes("shorts/")) {
      return url.split("/shorts/")[1]?.split("?")[0];
    } else if (url.includes("v=")) {
      return url.split("v=")[1]?.split("&")[0];
    }
    return null;
  };

  // Keep the active thumbnail visible inside the strip. Scrolls only the
  // strip itself (not the page) so the page doesn't jump.
  const thumbsRef = useRef(null);
  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip) return;
    const activeThumb = strip.children[currentIndex];
    if (!activeThumb) return;
    const target =
      activeThumb.offsetLeft - strip.clientWidth / 2 + activeThumb.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [currentIndex, slides.length]);

  const getThumbSrc = (slide) => {
    if (slide.type === "video") {
      const id = getVideoId(slide.videoUrl);
      return id ? `https://img.youtube.com/vi/${id}/default.jpg` : "";
    }
    const path = slide.src?.startsWith("/") ? slide.src : `/${slide.src}`;
    return `${process.env.PUBLIC_URL}${path}`;
  };

  const handleGoBackToDay = () => setDarkMode(false);

  const goPrev = () => {
    setIsVideoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIsVideoPlaying(false);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  if (slides.length === 0) {
    return (
      <div id="product-grid" className="project-carousel">
        <div className="no-images-found">
          No images found.
          <span
            onClick={handleGoBackToDay}
            style={{ cursor: "pointer", marginLeft: "5px", color: "blue", textDecoration: "underline" }}
          >
            Go Back to Day
          </span>
        </div>
      </div>
    );
  }

  const activeIndex = Math.min(currentIndex, slides.length - 1);
  const activeSlide = slides[activeIndex];
  const imagePath = activeSlide.type === "image"
    ? (activeSlide.src?.startsWith("/") ? activeSlide.src : `/${activeSlide.src}`)
    : null;

  return (
    <div id="product-grid" className="project-carousel">
      <div className="carousel-viewport">
        {activeSlide.type === "video" ? (
          <VideoSlide
            videoUrl={activeSlide.videoUrl}
            isPlaying={isVideoPlaying}
            onPlay={() => setIsVideoPlaying(true)}
            getVideoId={getVideoId}
          />
        ) : (
          <img
            key={activeSlide.src}
            src={`${process.env.PUBLIC_URL}${imagePath}`}
            alt={activeSlide.alt}
            className="carousel-image"
            loading="lazy"
          />
        )}

        {slides.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-prev"
              onClick={goPrev}
              aria-label="Previous image"
              type="button"
            >
              &#8249;
            </button>
            <button
              className="carousel-arrow carousel-arrow-next"
              onClick={goNext}
              aria-label="Next image"
              type="button"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="carousel-thumbs-wrap">
          <button
            type="button"
            className="thumbs-arrow"
            onClick={goPrev}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className="carousel-thumbs" ref={thumbsRef}>
            {slides.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                className={`carousel-thumb ${idx === activeIndex ? "active" : ""}`}
                onClick={() => {
                  setIsVideoPlaying(false);
                  setCurrentIndex(idx);
                }}
                aria-label={`Show slide ${idx + 1} of ${slides.length}`}
                aria-current={idx === activeIndex}
              >
                <img
                  src={getThumbSrc(slide)}
                  alt=""
                  loading="lazy"
                  width={96}
                  height={64}
                />
                {slide.type === "video" && (
                  <span className="thumb-play">
                    <FaPlay size={12} color="white" />
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="thumbs-arrow"
            onClick={goNext}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

const VideoSlide = ({ videoUrl, isPlaying, onPlay, getVideoId }) => {
  const videoId = getVideoId(videoUrl);
  if (!videoId) return null;

  return isPlaying ? (
    <iframe
      className="carousel-video"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title="YouTube Video"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  ) : (
    <div className="carousel-video-thumb" onClick={onPlay}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="YouTube Video Thumbnail"
        className="carousel-image"
        loading="lazy"
      />
      <div className="play-icon">
        <FaPlay size={40} color="white" />
      </div>
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

const BuildButton = ({ projectSlug }) => {
  return (
    <a href={`/build/?project=${projectSlug}/`}>
      <button id="build-button" className="mobile-controls hover-button">
        <span>Build Your Dream</span>
      </button>
    </a>
  );
};

export default SingleProject;