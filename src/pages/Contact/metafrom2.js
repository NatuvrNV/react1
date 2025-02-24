import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import { useLocation } from "react-router-dom";

const Contact = ({ brochureName }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation(); // Detect current page URL
  const pageBrochureMap = {
    "/metasurface": "MetaSurface",
    "/metaparametric": "MetaParametric",
    "/metaform": "MetaForm",
    "/metafunction": "MetaFunction",
    "/ctb": "Coffee Table Book",
  };

  const detectedBrochure = pageBrochureMap[location.pathname] || brochureName || "Unknown";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState(""); // State to store success/failure message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  // Function to open the correct PDF in a new tab
  const openPDF = () => {
    const brochureMap = {
      MetaSurface: "/assets/brochure/METASURFACE.pdf",
      MetaParametric: "/assets/brochure/METAPARAMETRIC.pdf",
      MetaForm: "/assets/brochure/METAFORM.pdf",
      MetaFunction: "/assets/brochure/METAFUNCTION.pdf",
      "Coffee Table Book": "/assets/brochure/12-2-25-mobile.pdf",
    };

    const filePath = brochureMap[detectedBrochure];

    if (filePath) {
      window.open(filePath, "_blank"); // Open in a new tab
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage(""); // Reset message on submit

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      user_phone: formData.phone,
      message: `The user has requested the ${detectedBrochure} brochure.`,
    };

    try {
      await emailjs.send(
        "service_o43hhwe", // Replace with your actual Service ID
        "template_aca3uxp", // Replace with your actual Template ID
        emailParams,
        "xnaiRgy_8MdLN2Vh5" // Replace with your actual Public Key
      );

      openPDF(); // Open the brochure in a new tab
      setMessage("✅ Thanks for your query! Your download will begin shortly.");
      
      // Reset form fields
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("❌ Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Download {detectedBrochure} Brochure | Luxury Metal Facades & Cladding</title>
        <meta
          name="description"
          content={`Explore our premium ${detectedBrochure} designs. Download the brochure for innovative architectural surfaces.`}
        />
        <meta
          property="og:title"
          content={`Download ${detectedBrochure} Brochure | Luxury Metal Facades & Cladding`}
        />
        <meta
          property="og:description"
          content={`Explore our premium ${detectedBrochure} designs. Download the brochure for innovative architectural surfaces.`}
        />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest in</p>
              <p>{detectedBrochure} brochure!</p>
            </div>
            <div className="lead-contact">
              <p>Please fill the form to download it.</p>
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
                      placeholder="Enter phone number with Country Code"
                      dropdownClass="bg-dark text-white"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="button-wrapper">
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Sending..." : `Send & View ${detectedBrochure} Brochure`}</span>
                </button>
              </div>

              {/* Message Display */}
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
