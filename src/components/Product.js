import React, { useRef, useState, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import Product1 from "../assets/products/coin.webp";
import Product2 from "../assets/products/sequin.webp";
import Product3 from "../assets/products/caskey.webp";
import Product4 from "../assets/products/shingle.webp";
import Arrow from "../assets/arrow.png";
import gsap from "gsap";
import { Link } from "react-router-dom";


const Product = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

const products = useMemo(
  () => [
    { id: 1, name: "MetaCoin", image: Product1, slug: "metacoin", alt: "MetaCoin panels with round golden discs forming a coin matrix that creates a rippling surface illusion." },
    { id: 2, name: "MetaSequin", image: Product2, slug: "metasequin", alt: "Custom-shaped golden MetaSequins catching fiery red light, forming a shimmering, parametric facade." },
    { id: 3, name: "Cascading Keys", image: Product3, slug: "cascadingkeys", alt: "Reflective Cascading Keys arranged vertically on the facade of a building creating a kinetic facade." },
    { id: 4, name: "MetaShingles", image: Product4, slug: "metashingle", alt: "Curved balcony facade clad in monochromatic grey MetaShingles with a fish scale-like texture." }
  ],
  []
);


  // Mouse Enter animation
  const handleMouseEnter = useCallback((e) => {
    const arrow = e.currentTarget.querySelector(".arrow-icon");
    const name = e.currentTarget.querySelector(".product-card p");
    gsap.to(arrow, { x: 20, opacity: 1, duration: 0.2, ease: "bounce.in" });
    gsap.to(name, { x: -10, duration: 0.2 });
  }, []);

  // Mouse Leave animation
  const handleMouseLeave = useCallback((e) => {
    const arrow = e.currentTarget.querySelector(".arrow-icon");
    const name = e.currentTarget.querySelector(".product-card p");
    gsap.to(arrow, { x: 0, opacity: 0, duration: 0.2 });
    gsap.to(name, { x: 0, duration: 0.2 });
  }, []);

  // Scroll handler for updating active slide
  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const itemWidth = sliderRef.current.offsetWidth / 1.5;
      setActiveSlide(Math.round(scrollPosition / itemWidth));
    }
  }, []);

  return (
    <Container className="top-products-section text-center">
      <h1 className="products-title">Top Products</h1>
      <div className="product-container">
        {/* Desktop View */}
        <div className="desktop-view">
          <Row className="product-row my-4">
            {products.map((product) => (
              <Col key={product.id} xs={6} md={6} lg={3} className="product-col mb-4">
                <Link
                  to={`/all-products/${product.slug}`}
                  className="product-card tw-cursor-pointer"
                  onClick={() => console.log("Navigating to:", product.slug)}
                >
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="product-card tw-cursor-pointer"
                  >
                    <img src={product.image} alt={product.alt} className="product-image" />
                    <p className="font tw-flex tw-justify-center tw-items-center">
                      <span className="font-span">{product.name}</span>
                      <img src={Arrow} alt="arrow" className="arrow-icon" />
                    </p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        {/* Mobile View */}
        <div className="mobile-view">
          <div id="top-container" className="slider-container" ref={sliderRef} onScroll={handleScroll}>
            {products.map((product) => (
              <Link key={product.id} to={`/all-products/${product.slug}`} className="slider-item">
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="product-card tw-cursor-pointer">
                 <img src={product.image} alt={product.alt} className="product-image" />
                  <p className="font tw-flex tw-justify-center tw-items-center">
                    <span className="font-span">{product.name}</span>
                    <img src={Arrow} alt="arrow" className="arrow-icon" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div id="product-dots" className="pagination-dots">
            {products.map((_, index) => (
              <span key={index} className={`dot ${index === activeSlide ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      {/* See All Products Button */}
      <button
        id="product-button"
        className="hover-button"
        onClick={() => {
          window.scrollTo(0, 0);
          navigate("/all-products");
        }}
      >
        <span>See All Products</span>
      </button>
    </Container>
  );
};

export default Product;
