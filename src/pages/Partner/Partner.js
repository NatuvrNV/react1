import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer"; // Import Footer component
import "./Partner.css";
import { Helmet } from "react-helmet-async";

const Partner = () => {
  return (
    <>
           <Helmet>
                              <title>Partner with Metaguise | Let's Collaborate on Innovative Facades</title>
                              <meta name="description" content="Collaborate with Metaguise on groundbreaking facade designs. Let’s create, innovate, and redefine architectural excellence together" />
                              <meta name="keywords" content="home, react, SEO, web development" />
                              <meta name="author" content="Your Name" />
                              <meta property="og:title" content="Partner with Metaguise | Let's Collaborate on Innovative Facades" />
                              <meta property="og:description" content="Collaborate with Metaguise on groundbreaking facade designs. Let’s create, innovate, and redefine architectural excellence together" />
                              <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />
                              <meta property="og:url" content="https://yourwebsite.com/" />
                              <meta name="robots" content="index, follow" />
                            </Helmet>
      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          {/* Left Section */}
          <Col
            md={6}
            className="contact-left d-flex flex-column justify-content-center gap-4"
          >
            <div id="contact-desktop" className="contactus-text">
              <p>We'd Love</p>
              <p>to Work</p>
              <p>With You.</p>
            </div>

            <div id="contact-mob" className="contactus-text">
              <p>We'd Love to </p>
              <p>Work With You.</p>
              
            </div>
            <div className="lead-contact">
              <p>Interested in collaborating with us?</p>
              <p>Let's discuss how we can help and</p>
              <p>support your creative needs.</p>
            </div>
          </Col>

          {/* Right Section */}
          <Col
            md={6}
            className="contact-right d-flex flex-column justify-content-center"
          >
            <Form className="w-100">
              <Row>
                <Col md={6} className="mb-3 mb-md-4">
                  <Form.Group controlId="formName">
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      className="bg-contact form-text border-0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3 mb-md-4">
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      className="bg-contact form-text border-0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formMessage" className="mb-4">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Message"
                  className="bg-contact form-text border-0"
                />
              </Form.Group>

              <div className="button-wrapper">
                <button type="submit" className="send-button">
                  <span>Send</span>
                </button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Add Footer */}
      <Footer />
    </>
  );
};

export default Partner;
