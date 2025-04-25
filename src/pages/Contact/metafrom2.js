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

  const location = useLocation();
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
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const openPDF = () => {
    const brochureMap = {
      Metasurface: "/assets/brochure/METASURFACE.pdf",
      Metaparametric: "/assets/brochure/METAPARAMETRIC.pdf",
      MetaForm: "/assets/brochure/METAFORM.pdf",
      Metafunction: "/assets/brochure/METAFUNCTION.pdf",
      "Coffee Table Book": "/assets/brochure/ctb.pdf",
    };

    const filePath = brochureMap[detectedBrochure];

    if (filePath) {
      setTimeout(() => {
        window.open(filePath, "_blank", "noopener,noreferrer");
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      message: `The user has requested the ${detectedBrochure} brochure.`,
    };

    try {
      await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        emailParams,
        "aEASMHR8n6Vmgtj3l"
      );

      // 🔥 Google Ads Conversion Tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_", // Replace with your actual Google Ads Conversion ID and Label
        });
      }

      openPDF();
      setMessage("✅ Thanks for your query! Your download will begin shortly.");
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
        <title>Download {detectedBrochure} | Coffee Table Book on Metal Facades</title>
        <meta name="description" content={`Journey through landmark metal facade projects and in our signature coffee table book.`} />
        <meta property="og:title" content={`Download ${detectedBrochure} Brochure | Coffee Table Book on Metal Facades`} />
        <meta property="og:description" content={`Journey through landmark metal facade projects and in our signature coffee table book.`} />

                  {/* ✅ Canonical Tag */}
  <link
    rel="canonical"
    href={`https://metaguise.com${location.pathname}`}
  />

           {/* ✅ Google Ads Conversion Tracking Script */}
           <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16992180594"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16992180594');
          `}
        </script>
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest in</p>
              <p>{detectedBrochure}</p>
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
                      country={"in"}
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
                  <span>{isSending ? "Sending..." : `Send & View ${detectedBrochure}`}</span>
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
