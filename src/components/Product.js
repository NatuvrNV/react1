import React, { useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import Product1 from "../assets/products/coin.jpg";
import Product2 from "../assets/products/sequin.png";
import Product3 from "../assets/products/caskey.jpg";
import Product4 from "../assets/products/shingle.jpg";
import Arrow from "../assets/arrow.png";
import gsap from "gsap";
import { Link } from 'react-router-dom';



const products = [
  { id: 1, name: "MetaCoin", image: Product1, slug: "metacoin" },
  { id: 2, name: "MetaSequin", image: Product2, slug: "metasequin" },
  { id: 3, name: "Cascading Keys", image: Product3, slug: "cascadingkeys" },
  { id: 4, name: "MetaShingles", image: Product4, slug: "metashingle" }
];

const Product = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function
  const sliderRef = useRef(null);
  gsap.registerPlugin();

  const handleMouseEnter = (e) => {
    const arrow = e.currentTarget.querySelector(".arrow-icon");
    const name = e.currentTarget.querySelector(".product-card p");
    gsap.to(arrow, { x: 20, duration: 0.2, opacity: 1, ease: "bounce.in" });
    gsap.to(name, { x: -10, duration: 0.2 });
  };

  const handleMouseLeave = (e) => {
    const arrow = e.currentTarget.querySelector(".arrow-icon");
    const name = e.currentTarget.querySelector(".product-card p");
    gsap.to(arrow, { x: 0, duration: 0.2, opacity: 0 });
    gsap.to(name, { x: 0, duration: 0.2 });
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const itemWidth = sliderRef.current.offsetWidth / 1.5;
      const newActiveSlide = Math.round(scrollPosition / itemWidth);
      setActiveSlide(newActiveSlide);
    }
  };

  // Handle navigation on click
  const handleProductClick = (slug) => {
    // You can perform other actions here (e.g., analytics tracking) before navigating
    console.log("Navigating to product:", slug); // Example logging
  };

  return (
    <Container className="top-products-section text-center">
      <h1 className="products-title">Top Products</h1>
      <div className="product-container">
        <div className="desktop-view">
          <Row className="product-row my-4">
            {products.map((product) => (
              <Col key={product.id} xs={6} md={6} lg={3} className="product-col mb-4">
                {/* Link and handle click navigation */}
                <Link 
                  to={`/all-products/${product.slug}`} 
                  onClick={() => handleProductClick(product.slug)}
                  className="product-card tw-cursor-pointer"
                >
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="product-card tw-cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <p className="font tw-flex tw-justify-center tw-items-center">
                      <span className="font-span">{product.name}</span>
                      <img src={Arrow} alt="arrow" className="arrow-icon"></img>
                    </p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        <div className="mobile-view">
          <div id="top-container" className="slider-container" ref={sliderRef} onScroll={handleScroll}>
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/all-products/${product.slug}`} 
                onClick={() => handleProductClick(product.slug)}
                className="slider-item"
              >
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="product-card tw-cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <p className="font tw-flex tw-justify-center tw-items-center">
                    <span className="font-span">{product.name}</span>
                    <img src={Arrow} alt="arrow" className="arrow-icon"></img>
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

      
      <button 
  id="product-button" 
  className="hover-button" 
  onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/all-products");
  }}
>
  <span>See All Products</span>
</button>
      
    </Container>
  );
};

export default Product;
