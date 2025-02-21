import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, ListGroup, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import { MdArrowOutward } from "react-icons/md";
import "./Allproducts.css";
import { SingleProductDetail } from "../../utils/constants";
import { ProductImages as images } from "../../utils/constants";
import { Helmet } from "react-helmet-async";

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

  function productClickHandler(img) {
    const selectedSubProductcat = img.imgPath.split("/")[3].toLowerCase();
    const selectedProduct = SingleProductDetail.find((item) => item.name.toLowerCase() === selectedSubProductcat);
    navigate(`/all-products/${selectedSubProductcat}`, { state: { selectedProduct } }); // Redirect to SingleProduct page with dynamic URL
    // navigate(`/single-product/${selectedSubProductcat}`, { state: { selectedProduct } }); // Redirect to SingleProduct page with dynamic URL
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
                    <title>Metaguise Products | Premium Metal Facades & Cladding</title>
                    <meta name="description" content="Explore Metaguise’s range of luxury metal facades, cladding, parametric designs, and surface finishes for modern architectural excellence" />
                    <meta name="keywords" content="home, react, SEO, web development" />
                    <meta name="author" content="Your Name" />
                    <meta property="og:title" content="Metaguise Products | Premium Metal Facades & Cladding" />
                    <meta property="og:description" content="Explore Metaguise’s range of luxury metal facades, cladding, parametric designs, and surface finishes for modern architectural excellence" />
                    <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />
                    <meta property="og:url" content="https://yourwebsite.com/" />
                    <meta name="robots" content="index, follow" />
                  </Helmet>
      <div className="gallery-content">
        <Container fluid>
          <Row>
            <div className="mobile-title">
              <h1>Our Products</h1>
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
                      <img
                        src={`${process.env.PUBLIC_URL}/${img.imgPath}`}
                        alt={img.imgText}
                        loading="lazy"
                      />
                    </div>
                    <div className="image-text">{img.imgText}</div>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={2} className="mb-3">
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
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaabIioPAYAnCxDaY2hFZjSf7qeU9qJGc_DuYZxtxI_G_nWUTiefpS62FNo_aem_KRmg-CrKFIxQiXf9Mtglow">
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

export default Allproducts;