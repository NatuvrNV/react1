import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Drawer.css";
import logo1 from "../assets/metaguiseblk.png";
import { MdArrowOutward } from "react-icons/md";  // Import the icon

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
          className="d-flex flex-column  p-4 contact-section"
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
          <div className="text-justify px-2 ">
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

              <p className="nav-text" style={{ paddingLeft: "40px",lineHeight:"30px" }}>
              Visit our Flagship experience Center at <br></br>
                 Basement Floor, K9/46, DLF PH 2, Gurgaon, Haryana
                 <br></br>

<a id="visit"
      href="https://www.google.com/maps/place/METALAND%E2%84%A2+BY+METAGUISE%C2%AE/@28.4631664,77.0973513,17z/data=!3m1!4b1!4m6!3m5!1s0x390d19455a6f62b1:0x60bdf56eb4db946d!8m2!3d28.4631664!4d77.0973513!16s%2Fg%2F11tk30q8yv?entry=ttu&g_ep=EgoyMDI1MDIxOC4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
      className="visit-now-link"
    >
      Visit Now <MdArrowOutward></MdArrowOutward>
    </a>
               
              </p>
              {/* First Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Get in Touch</h5>
                  <a className="nav-text" href="mailto:contactus@metaguise.com">contactus@metaguise.com</a>
                  
                </div>
              </Col>

              {/* Second Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding">Phone</h5>
                  <a className="nav-text" href="tel:9811604449">
                  9811604449 / 9355604449
                  </a>
                
                </div>
              </Col>
            </Row>
          </Container>
          <Container id="social">
            <Row>
              {/* First Section */}
              <Col md={6}>
                <div>
                  <h5 className="nav-haeding ">Social</h5>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      paddingLeft: "30px",
                    }}
                  >
                    <a
                      href="https://www.facebook.com/metaguise"
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
                      href="https://www.instagram.com/metaguise/"
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
                      href="https://www.youtube.com/@metaguise"
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
