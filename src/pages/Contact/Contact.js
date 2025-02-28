import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer"; // Import Footer component
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser"; // Import EmailJS for SMTP

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  useEffect(() => {
    const inputField = document.querySelector(".form-text input");
    if (inputField) {
      if (!formData.phone || formData.phone.length <= 3) {
        inputField.setAttribute("placeholder", "Enter your mobile number");
      } else {
        inputField.setAttribute("placeholder", "");
      }
    }
  }, [formData.phone]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsSending(true);
    setFeedbackMessage("");

      // Validate fields before proceeding
  if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
    setFeedbackMessage("❌ All fields are required.");
    setIsSending(false);
    return;
  }

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
       from_phone: formData.phone,
      message: formData.message,
    };

    try {
      const response = await emailjs.send(
        "service_hbh6e6a", // Replace with your actual Service ID
        "template_sp4d06m", // Replace with your actual Template ID
        emailParams,
        "aEASMHR8n6Vmgtj3l" // Replace with your actual Public Key
      );

      console.log("Email sent successfully!", response);
      setFeedbackMessage("Thank you for your enquiry. We will get in touch with you soon!");
      setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form fields
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
        <title>Contact Metaguise | Get in Touch for Facade Solutions</title>
        <meta name="description" content="Reach out to Metaguise for inquiries, collaborations, or project consultations. Let’s discuss your facade needs and bring your vision to life" />
        <meta property="og:title" content="Contact Metaguise | Get in Touch for Facade Solutions" />
        <meta property="og:description" content="Reach out to Metaguise for inquiries, collaborations, or project consultations. Let’s discuss your facade needs and bring your vision to life" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex align-items-center justify-content-center gap-4">
            <div id="contact-desktop" className="contactus-text">
              <p>We'd Love</p>
              <p>to Connect</p>
              <p>with You.</p>

              <div className="lead-contact mt-4">
              <p>Share your vision, and let's create</p>
              <p>something amazing together.</p>
            </div>
            </div>
            <div id="contact-mob" className="contactus-text">
              <p>We'd Love to </p>
              <p>Connect with You.</p>
            </div>
          
          </Col>

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

              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <Form.Group controlId="formPhone">
                  <PhoneInput
  enableSearch
  inputClass="bg-contact form-text border-0 w-100"
  containerClass="w-100"
  inputStyle={{ width: "100%" }}
  dropdownClass="bg-dark text-white"
  value={formData.phone}
  onChange={handlePhoneChange}
  placeholder="Enter phone number with Country Code " // Added placeholder here
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
                  placeholder="Tell us more about your Project"
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

              {feedbackMessage && (
                <p className={`mt-3 ${feedbackMessage.includes("success") ? "text-success" : "text"}`}>
                  {feedbackMessage}
                </p>
              )}
            </Form>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Contact;
