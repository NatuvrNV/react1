import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Container, Row, Col, ListGroup, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import { MdArrowOutward } from "react-icons/md";
import "./Allproducts.css";
// SingleProductDetail used to be a static import (~62 KB in every bundle).
// The listing page only ever needed name/thumbnail/meta, so it now fetches
// the lightweight products index instead.
import { fetchProductsIndex } from "../../utils/fetchProductData";
import { ProductImages as images } from "../../utils/constants";
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

const categories = [
  { name: "All", value: "" },
  { name: "MetaParametric", value: "MetaParametric" },
  { name: "MetaForm", value: "MetaForm" },
  { name: "MetaFunction", value: "MetaFunction" },
  { name: "MetaSurfaces", value: "MetaSurface" },
];

const Allproducts = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate(); // Initialize navigate function
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);

  // Lightweight index (name, thumbnail, meta only) — replaces the old
  // full-detail SingleProductDetail static import.
  const [productsIndex, setProductsIndex] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchProductsIndex()
      .then((data) => {
        if (cancelled) return;
        // Guard against a non-array response (e.g. the wrong JSON file
        // ending up at /data/products-index.json) so a bad deploy shows
        // an empty product grid instead of crashing the whole page.
        if (Array.isArray(data)) {
          setProductsIndex(data);
        } else {
          console.error(
            "products-index.json did not return an array — got:",
            data
          );
          setProductsIndex([]);
        }
      })
      .catch(() => {
        if (!cancelled) setProductsIndex([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

function productClickHandler(img) {
  const selectedSubProductcat = img.imgPath.split("/")[3].toLowerCase();
  if (!Array.isArray(productsIndex)) {
    console.error("productsIndex is not an array, cannot navigate:", productsIndex);
    return;
  }
  const selectedProduct = productsIndex.find((item) => item.name.toLowerCase() === selectedSubProductcat);
  navigate(`/all-products/${selectedSubProductcat}/`, { state: { selectedProduct } });
}

  function filterImagesByCategory(category) {
    setSelectedCategory(category);
  }

  // Filter images based on selected category
  const filteredImages = selectedCategory
    ? images.filter((img) => img.imgPath.includes(selectedCategory))
    : images;

  const location = useLocation();

  useEffect(() => {
    const handleScrollBehavior = () => {
      const isMobile = window.innerWidth <= 768;
      if (location.pathname === "/all-products" && !isMobile) {
        // Only prevent scrolling on desktop
        document.body.style.overflowY = "hidden";
      } else {
        // Allow scrolling on mobile or other pages
        document.body.style.overflowY = "auto";
      }
    };

    // Initial check
    handleScrollBehavior();

    // Add resize listener to update scroll behavior when screen size changes
    window.addEventListener("resize", handleScrollBehavior);

    // Cleanup
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
                    <title>23+ Metal Facade Products | MetaCoin, MetaFin, MetaLouver & More | Metaguise</title>
                    <meta name="description" content="Browse all 23 Metaguise facade products, MetaCoin, MetaFin, MetaLouver, Cascading Keys and more. Compare designs and find the right system for your building." />
                    <meta name="keywords" content="metal facade products, metal cladding panels, parametric facade products" />
                    <meta property="og:title" content="23+ Metal Facade Products | MetaCoin, MetaFin, MetaLouver & More | Metaguise" />
                    <meta property="og:description" content="Browse all 23 Metaguise facade products, MetaCoin, MetaFin, MetaLouver, Cascading Keys and more. Compare designs and find the right system for your building." />
                    <meta property="og:image" content="https://metaguise.com/home-image.jpg" />
                    <meta property="og:url" content="https://metaguise.com/all-products/" />
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://metaguise.com/all-products/" />
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
              <h2>Our Products</h2>
            </div>
            <Col md={9}>
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
                      {categories.map((category) => (
                       // Update the Dropdown.Item in the mobile view
<Dropdown.Item
  key={category.value}
  onClick={() => {
    filterImagesByCategory(category.value);
    setShowDropdown(false);
  }}
  active={selectedCategory === category.value}
>
  <div className="d-flex justify-content-between align-items-center">
    {category.name}
    {selectedCategory === category.value && (
      <MdArrowOutward className="ms-2" />
    )}
  </div>
</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}

              <div className="gallery">
                {filteredImages.map((img, index) => (
                  <div
                    key={index}
                    className="gallery-item"
                    onClick={() => productClickHandler(img)}
                  >
                    <div className="hover-effect">
                      {/* ✅ Task 2 — width/height added to prevent layout shift (Task 10) */}
                      <img
                        src={`${process.env.PUBLIC_URL}/${img.imgPath}`}
                        alt={img.imgText}
                        width={640}
                        height={480}
                        loading="lazy"
                      />
                    </div>
                    {/* ✅ Task 2 — real heading instead of a bare div */}
                    <h3 className="image-text">{img.imgText}</h3>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={2} className="mb-3">
              {/* This is now the page's single H1. Unchanged. */}
              <h1 className="desktop-title mb-3">Our Products</h1>

              <div className="sidebar">
                <h4 className="mb-3">Filter by Type</h4>
                <ListGroup>
                  {categories.map((category) => (
                   // Update the ListGroup.Item in the desktop view
<ListGroup.Item
  key={category.value}
  action
  onClick={() => filterImagesByCategory(category.value)}
  className={selectedCategory === category.value ? "highlight" : "dim"}
>
  <div className="d-flex justify-content-between align-items-center">
    {category.name}
    {selectedCategory === category.value && (
      <MdArrowOutward className="ms-2" />
    )}
  </div>
</ListGroup.Item>
                  ))}
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
      <Container as="section" className="products-copy py-5" style={srOnlyStyle}>
        <Row>
          <Col lg={8} className="mx-auto">
            <h2>Explore Metaguise's Parametric, Kinetic, and Value-Driven Facade Technologies</h2>
            <p>
              Metaguise designs, manufactures and installs metal facade
              systems for residential, commercial, and institutional
              buildings across India. Our parametric, kinetic, and
              value-driven systems are engineered in aluminium, stainless
              steel, brass, copper, or zinc - with VOC-free PVDF and
              powder-coat finishes carrying 15 to 30-year warranties. Browse
              our facade products below to find the right system for your
              project.
            </p>

            <h2>Explore Metal Facade Products by Style</h2>
            <p>
              Choose from perforated screens, solid panels, 3D-textured
              systems, and kinetic facades - depending on the visual
              character you want for your building's elevation.
            </p>

            <h2>Explore Metal Facade Products by Material</h2>
            <p>
              Every Metaguise system is available in aluminium, stainless
              steel, copper, brass, or zinc - so you can match the facade to
              your budget, maintenance preference, and climate.
            </p>

            <h2>Why Architects Choose Metaguise Facade Systems</h2>
            <p>
              Metaguise has completed 1,800+ projects pan-India, with
              in-house parametric design, precision fabrication, and
              coatings tested for India's climate extremes.
            </p>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Allproducts;