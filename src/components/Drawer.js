import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Drawer.css";
import logo1 from "../assets/metaguiseblk.png";

function Drawer({ isOpen, toggleDrawer }) {
  return (
    <Container fluid className={`drawer ${isOpen ? "open" : ""}`}>
      <Row className="h-100">
        {/* Navbar Section */}
        <Col
          md={4}
          className="bg-dark text-white d-flex flex-column justify-content-center p-4 nav-section"
        >
          <div>
            <Nav className="flex-column">
              <Nav.Link className="text-white" href="/">
                Home
              </Nav.Link>
              <Nav.Link className="text-white" href="/about">
                About Us
              </Nav.Link>
              <Nav.Link className="text-white" href="/all-products">
                Our Products
              </Nav.Link>
              <Nav.Link className="text-white" href="/all-projects">
                Our Projects
              </Nav.Link>
              <Nav.Link className="text-white" href="/partner">
                Partner With Us
              </Nav.Link>
              <Nav.Link className="text-white" href="/contact">
                Get In Touch
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Contact Section */}
        <Col
          md={8}
          className="d-flex flex-column justify-content-center p-4 contact-section"
        >
          <div className="text-right">
            <button
              className="btn btn-outline-dark"
              onClick={toggleDrawer}
              style={{ float: "right" }}
            >
              ✕
            </button>
          </div>
          <div className="text-justify ">
            <img
              src={logo1}
              alt="Metaguise Logo"
              style={{ maxWidth: "200px", paddingLeft: "5x" }}
            />
          </div>
          <Container>
            <Row>
              <h5 className="nav-haeding" style={{ paddingLeft: "40px" }}>
                Metaland by Metaguise
              </h5>
              <p className="nav-text" style={{ paddingLeft: "40px" }}>
                Basement Floor, K9/46, DLF PH 2, <br></br>Gurgaon, Haryana
              </p>
              {/* First Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Email</h5>
                  <p className="nav-text">contactus@metaguise.com</p>
                </div>
              </Col>

              {/* Second Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Phone</h5>
                  <p className="nav-text">9811604449 / 9355604449</p>
                </div>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              {/* First Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Social</h5>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      paddingLeft: "30px",
                    }}
                  >
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "#3b5998",
                        fontSize: "24px",
                      }}
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "#C13584",
                        fontSize: "24px",
                      }}
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "#FF0000",
                        fontSize: "24px",
                      }}
                    >
                      <FaYoutube />
                    </a>
                  </div>
                </div>
              </Col>

              {/* Second Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Legal</h5>
                  <p className="nav-text">Privacy | Terms</p>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Drawer;
