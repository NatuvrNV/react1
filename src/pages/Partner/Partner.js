import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer"; // Import Footer component
import "./Partner.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser"; // Import EmailJS for SMTP

const Partner = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsSending(true);
    setFeedbackMessage("");

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    try {
      const response = await emailjs.send(
        "service_o43hhwe", // Replace with your actual Service ID
        "template_aca3uxp", // Replace with your actual Template ID
        emailParams,
        "xnaiRgy_8MdLN2Vh5" // Replace with your actual Public Key
      );

      console.log("Email sent successfully!", response);
      setFeedbackMessage("Email sent successfully! We'll be in touch soon.");
      setFormData({ name: "", email: "", message: "" }); // Reset form fields
    } catch (error) {
      console.error("Error sending email:", error);
      setFeedbackMessage("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner with Metaguise | Let's Collaborate on Innovative Facades</title>
        <meta name="description" content="Collaborate with Metaguise on groundbreaking facade designs. Let’s create, innovate, and redefine architectural excellence together" />
        <meta property="og:title" content="Partner with Metaguise | Let's Collaborate on Innovative Facades" />
        <meta property="og:description" content="Collaborate with Metaguise on groundbreaking facade designs. Let’s create, innovate, and redefine architectural excellence together" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          {/* Left Section */}
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
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
          <Col md={6} className="contact-right d-flex flex-column justify-content-center">
            <Form className="w-100" onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3 mb-md-4">
                  <Form.Group controlId="formName">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="bg-contact form-text border-0"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3 mb-md-4">
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="bg-contact form-text border-0"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formMessage" className="mb-4">
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  placeholder="Message"
                  className="bg-contact form-text border-0"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="button-wrapper">
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Sending..." : "Send"}</span>
                </button>
              </div>

              {/* Feedback message */}
              {feedbackMessage && (
                <p className={`mt-3 ${feedbackMessage.includes("success") ? "text-success" : "text-danger"}`}>
                  {feedbackMessage}
                </p>
              )}
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
