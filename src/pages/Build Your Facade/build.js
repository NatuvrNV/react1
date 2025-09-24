import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./build.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    role: "",
    projectType: [],
    timeline: "",
    otherProject: "",
    otherTimeline: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) =>
        checked
          ? { ...prev, projectType: [...prev.projectType, value] }
          : { ...prev, projectType: prev.projectType.filter((item) => item !== value) }
      );
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle phone input
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // Submit form (no page refresh)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage("");

    // Basic validation
    if (!formData.name.trim() || !formData.city.trim() || !formData.phone.trim()) {
      setMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    const leadData = {
      name: formData.name,
      city: formData.city,
      phone: formData.phone,
      role: formData.role,
      projectType: formData.projectType.join(", "),
      otherProject: formData.otherProject,
      timeline: formData.timeline,
      otherTimeline: formData.otherTimeline,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("https://hook.eu2.make.com/jppie74gnfp2fvct6zrl5d02c4p0rk23", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        setMessage("✅ Lead sent successfully!");

        // Reset form fields only
        setFormData({
          name: "",
          city: "",
          phone: "",
          role: "",
          projectType: [],
          timeline: "",
          otherProject: "",
          otherTimeline: "",
        });
      } else {
        setMessage("❌ Failed to send data. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Metaguise</title>
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest</p>
              <p>Contact Us</p>
            </div>
          </Col>

          <Col md={6} className="contact-right d-flex flex-column justify-content-center">
            <Form className="w-100" onSubmit={handleSubmit}>
              {/* Name + Phone */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="bg-contact form-text border-0"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      inputClass="bg-contact form-text border-0 w-100"
                      placeholder="Enter phone number"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* City + Role */}
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Are You</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                    >
                      <option value="">Select...</option>
                      <option value="Architect">An Architect</option>
                      <option value="Real Estate Developer">A Real Estate Developer</option>
                      <option value="End User">An End User</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Project Type */}
              <Form.Group className="mt-3">
                <Form.Label>Type of Project</Form.Label>
                <div className="d-md-flex my-3 project-fields">
                  {["Residential", "Commercial", "Retail", "Hospitality"].map((type) => (
                    <Form.Check
                      key={type}
                      type="checkbox"
                      label={type}
                      value={type}
                      onChange={handleChange}
                      checked={formData.projectType.includes(type)}
                    />
                  ))}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Other"
                  name="otherProject"
                  className="bg-contact form-text border-0"
                  value={formData.otherProject}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Timeline */}
              <Form.Group className="mt-3">
                <Form.Label>How soon to engage Metaguise</Form.Label>
                <Form.Select
                  name="timeline"
                  value={formData.timeline}
                  className="bg-contact form-text border-0"
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Design stage">
                    Would like to engage on design though civil not ready yet
                  </option>
                </Form.Select>
              </Form.Group>

              {/* Submit */}
              <div className="mt-4 d-flex gap-2">
                <button type="submit" disabled={isSending} className="send-button">
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </div>

              {message && (
                <p className={`mt-3 ${message.includes("✅") ? "text-success" : "text-danger"}`}>
                  {message}
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
