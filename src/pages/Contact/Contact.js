import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFeedbackMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    // EmailJS params
    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      message: formData.message,
    };

    // API lead data
    const leadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: "contact_form",
    };

    try {
      // 🔹 Send Email via EmailJS
      await emailjs.send(
        "service_hbh6e6a",         // Replace with your EmailJS service ID
        "template_sp4d06m",        // Replace with your EmailJS template ID
        emailParams,
        "aEASMHR8n6Vmgtj3l"        // Replace with your EmailJS public key
      );

      // 🔹 Send lead to your admin backend
      const response = await fetch("https://metaguise.com/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (response.ok) {
        setFeedbackMessage("✅ Thank you for your enquiry. We will get in touch with you soon!");
        setFormData({ name: "", email: "", phone: "", message: "" });

        // 🔹 Optional: Google Ads Conversion Tracking
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
          });
        }
      } else {
        setFeedbackMessage(`❌ ${result.message || "Failed to submit. Please try again."}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setFeedbackMessage("❌ Server error. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Metaguise | Metal Facade Cladding Experts</title>
        <meta name="description" content="Reach out to Metaguise for inquiries, collaborations, or project consultations. Let’s discuss your facade needs and bring your vision to life" />
        <meta property="og:title" content="Contact Metaguise | Metal Facade Cladding Experts" />
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
              <p>We'd Love to</p>
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
                      placeholder="Enter phone number with Country Code"
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
                <p className={`mt-3 ${feedbackMessage.includes("✅") ? "text-success" : "text-danger"}`}>
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
