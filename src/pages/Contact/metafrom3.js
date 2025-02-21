import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer"; // Import Footer component
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
const Contact = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  return (
    <>
               <Helmet>
                                  <title>Download Metaparametric Brochure | Dynamic Facade Designs</title>
                                  <meta name="description" content="Discover our advanced parametric facade technologies, blending art & engineering. Get the brochure for innovative designs." />
                                  <meta name="keywords" content="home, react, SEO, web development" />
                                  <meta name="author" content="Your Name" />
                                  <meta property="og:title" content="Download Metaparametric Brochure | Dynamic Facade Designs" />
                                  <meta property="og:description" content="Discover our advanced parametric facade technologies, blending art & engineering. Get the brochure for innovative designs." />
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
         <div className="contactus1-text">
         <p>Thank you for </p>
              <p> showing interest in </p>
              <p> MetaParametric brochure! </p>
          
            </div>
            <div className="lead-contact">
              <p> Please fill the form to download it.</p>
             
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

        

              <Row>
       
       <Col md={12} className="mb-3 mb-md-4">
       <Form.Group controlId="formPhone">
                    <PhoneInput
                      country={'in'} // Default country code set to India (+91)
                      enableSearch // Enable search in the dropdown
                      inputClass="bg-contact form-text border-0 w-100"
                      containerClass="w-100"
                      inputStyle={{ width: "100%" }}
                      placeholder="Enter phone number with Country Code"
                      dropdownClass="bg-dark text-white" // Customize dropdown styling
                    />
                  </Form.Group>
         </Col>
       
       </Row>

              {/* <Form.Group controlId="formMessage" className="mb-4">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Message"
                  className="bg-contact form-text border-0"
                />
              </Form.Group> */}

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
