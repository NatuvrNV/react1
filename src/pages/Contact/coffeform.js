import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import reCAPTCHA
import emailjs from "@emailjs/browser"; // ✅ Added EmailJS to send data via email

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

  const detectedBrochure =
    pageBrochureMap[location.pathname] || brochureName || "Unknown";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `The user has requested the ${detectedBrochure} brochure.`,
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); // ✅ Captcha token state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const openPDF = () => {
    const brochureMap = {
      MetaSurface: "/assets/brochure/METASURFACE.pdf",
      MetaParametric: "/assets/brochure/METAPARAMETRIC.pdf",
      MetaForm: "/assets/brochure/METAFORM.pdf",
      MetaFunction: "/assets/brochure/METAFUNCTION.pdf",
      "Coffee Table Book": "/assets/brochure/ctb.pdf",
    };

    const filePath = brochureMap[detectedBrochure];
    if (filePath) {
      window.open(filePath, "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFeedbackMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    if (!captchaToken) {
      setFeedbackMessage("⚠️ Please complete the CAPTCHA before submitting.");
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
      await emailjs.send(
        "service_hbh6e6a", // ✅ Replace with your EmailJS service ID
        "template_sp4d06m", // ✅ Replace with your template ID
        emailParams,
        "aEASMHR8n6Vmgtj3l" // ✅ Replace with your public key
      );

      setFeedbackMessage("✅ Thanks for your query! Your download will begin shortly.");
      openPDF();

      // ✅ Google Ads Conversion Tracking Trigger
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `The user has requested the ${detectedBrochure} brochure.`,
      });
      setCaptchaToken(null);
    } catch (error) {
      console.error("Email send error:", error);
      setFeedbackMessage("❌ Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Download {detectedBrochure} Brochure | Luxury Metal Facades & Cladding
        </title>
        <link
          rel="canonical"
          href={`https://metaguise.com/${detectedBrochure}`}
        />
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
        {/* ✅ Google Ads Conversion Tracking */}
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
          <Col
            md={6}
            className="contact-left d-flex flex-column justify-content-center gap-4"
          >
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest in</p>
              <p>{detectedBrochure}</p>
            </div>
            <div className="lead-contact">
              <p>Please fill the form to download it.</p>
            </div>
          </Col>

          <Col
            md={6}
            className="contact-right d-flex flex-column justify-content-center"
          >
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

              {/* ✅ Google reCAPTCHA */}
              <div className="mb-3 text-center">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev" // ⚠️ Replace this with your actual reCAPTCHA v2 site key
                  onChange={handleCaptchaChange}
                />
              </div>

              <div className="button-wrapper">
                <button
                  type="submit"
                  className="send-button"
                  disabled={isSending}
                >
                  <span>
                    {isSending
                      ? "Sending..."
                      : `Send & View ${detectedBrochure} Brochure`}
                  </span>
                </button>
              </div>

              {feedbackMessage && <p className="mt-3">{feedbackMessage}</p>}
            </Form>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Contact;
