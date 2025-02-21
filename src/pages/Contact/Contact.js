import React from "react";
import { useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer"; // Import Footer component
import "./Contact.css";
import { Helmet } from "react-helmet-async";
const Contact = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <>
           <Helmet>
                              <title>Contact Metaguise | Get in Touch for Facade Solutions</title>
                              <meta name="description" content="Reach out to Metaguise for inquiries, collaborations, or project consultations. Let’s discuss your facade needs and bring your vision to life" />
                              <meta name="keywords" content="home, react, SEO, web development" />
                              <meta name="author" content="Your Name" />
                              <meta property="og:title" content="Contact Metaguise | Get in Touch for Facade Solutions" />
                              <meta property="og:description" content="Reach out to Metaguise for inquiries, collaborations, or project consultations. Let’s discuss your facade needs and bring your vision to life" />
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
              <p>to Connect</p>
              <p>with You.</p>
            </div>

            <div id="contact-mob" className="contactus-text">
              <p>We'd Love to </p>
              <p>Connect with You.</p>
              
            </div>
            <div className="lead-contact">
              <p>Share your vision, and let's create</p>
              <p>something amazing together.</p>
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

export default Contact;
