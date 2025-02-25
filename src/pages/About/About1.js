import React, { useEffect, useCallback } from "react";
import "./About.css";
import "./VisionAndMission.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../../components/Footer";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

// Import Images
import Image1 from "../../assets/Team/anuj.png";
import Image2 from "../../assets/Team/ashish.png";
import Image3 from "../../assets/Team/biren.png";
import Image4 from "../../assets/Team/kavita.png";
import Image5 from "../../assets/Team/manvendra.png";
import Image6 from "../../assets/Team/rashmi.png";
import Image7 from "../../assets/Team/sahil.png";
import Image8 from "../../assets/Team/sumit.png";
import About1 from "../../assets/about1.png";
import About2 from "../../assets/about2.png";
import Vision from "../../assets/vision.png";

function About() {
  // Optimize useEffect to prevent unnecessary re-renders
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="container-fluid text-center">
      {/* ✅ Meta Tags for SEO */}
      <Helmet>
        <title>Metaguise | Innovators in Luxury Metal Facades</title>
        <meta
          name="description"
          content="Metaguise pioneers high-end metal facades, blending craftsmanship, technology, and innovation to redefine modern architecture."
        />
        <meta name="keywords" content="home, react, SEO, web development" />
        <meta name="author" content="Your Name" />
        <meta property="og:title" content="Metaguise | Innovators in Luxury Metal Facades" />
        <meta
          property="og:description"
          content="Metaguise pioneers high-end metal facades, blending craftsmanship, technology, and innovation to redefine modern architecture."
        />
        <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="content">
        <h1 className="animated-text">
          {Array.from("Metaguise").map((letter, index) => (
            <span key={index} className="letter" style={{ animationDelay: `${index * 0.3}s` }}>
              {letter}
            </span>
          ))}
        </h1>

        {/* ✅ Image Section (Lazy Loading for Performance) */}
        <section className="scroll-section">
          <div className="container-fluid d-flex align-items-center justify-content-center">
            <div className="image-container left-image">
              <img src={About1} alt="About Us Left" className="animated-image" loading="lazy" />
            </div>

            <div className="centered-text text-white">
              <p className="text-center">
                DRV (Shri Deepak Raheja’s Vision) is the bloodline of all meta
                organizations, based on the life lessons taught by our founding
                father specifically focusing on a mindset  “Anything is
                Possible” when the will is unbreakable, standards
                un-challengable, energy in-exhaustible, morals un-corruptable
                and the aura unstoppable.
              </p>
            </div>

            <div className="image-container right-image">
              <img src={About2} alt="About Us Right" className="animated-image" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ✅ Vision & Mission Section */}
        <Container fluid className="mission-vision-section">
          <Row className="no-gutters">
            <Col md={6} className="vision-section">
              <div className="vision-container">
                <img src={Vision} alt="Vision" loading="lazy" />
                <h1 className="overlay-text-vision">Vision</h1>
              </div>
            </Col>
            <Col md={6} className="mission-section">
              <div className="mission-container">
                <h1 className="overlay-text-mision">Mission</h1>
              </div>
            </Col>
          </Row>
        </Container>

        {/* ✅ Video Section */}
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/a5ywhvysBJA?si=Tr90VnKyJ5pw6NWp"
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="lazy"
        ></iframe>

        {/* ✅ Image Slider (Bootstrap Carousel) */}
        <div className="container my-5">
          <h1 className="text-center">Meet The Team</h1>
          <div id="teamCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* ✅ First Slide */}
              <div className="carousel-item active">
                <div className="d-flex justify-content-center">
                  <img src={Image1} className="team-member-img" alt="Anuj" loading="lazy" />
                  <img src={Image2} className="team-member-img" alt="Ashish" loading="lazy" />
                  <img src={Image3} className="team-member-img" alt="Biren" loading="lazy" />
                  <img src={Image4} className="team-member-img" alt="Kavita" loading="lazy" />
                </div>
              </div>

              {/* ✅ Second Slide */}
              <div className="carousel-item">
                <div className="d-flex justify-content-center">
                  <img src={Image5} className="team-member-img" alt="Manvendra" loading="lazy" />
                  <img src={Image6} className="team-member-img" alt="Rashmi" loading="lazy" />
                  <img src={Image7} className="team-member-img" alt="Sahil" loading="lazy" />
                  <img src={Image8} className="team-member-img" alt="Sumit" loading="lazy" />
                </div>
              </div>
            </div>

            {/* ✅ Carousel Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#teamCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#teamCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}

export default About;
