import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import Footer from "../../components/Footer";
import "./Partner.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import CAPTCHA

const Partner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null); // ✅ Store CAPTCHA token
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const phoneInputField = document.querySelector(".phone-input input");
    if (phoneInputField) {
      phoneInputField.setAttribute("placeholder", "Enter your Mobile number");
    }
  }, [formData.phone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
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
      setFeedbackMessage("⚠️ Please complete the CAPTCHA verification.");
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
        "service_hbh6e6a",
        "template_sp4d06m",
        emailParams,
        "aEASMHR8n6Vmgtj3l"
      );

      console.log("Email sent successfully!", response);
      setFeedbackMessage("✅ Thank you for your enquiry. We will get in touch with you soon!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setCaptchaToken(null);

      // ✅ Google Ads Conversion Tracking Trigger
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setFeedbackMessage("❌ Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner with Metaguise | Innovative Facade Cladding Experts</title>
        <meta
          name="description"
          content="Collaborate with Metaguise on custom facade cladding and metal facade solutions designed for standout architectural impact."
        />
        <meta property="og:title" content="Partner with Metaguise | Innovative Facade Cladding Experts" />
        <meta
          property="og:description"
          content="Collaborate with Metaguise on custom facade cladding and metal facade solutions designed for standout architectural impact."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/partner" />

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
          <Col md={6} className="contact-left d-flex align-items-center justify-content-center gap-4">
            <div id="contact-desktop" className="contactus-text">
              <p>We'd Love</p>
              <p>to Work</p>
              <p>With You.</p>
              <div className="lead-contact mt-4">
                <p>Interested in collaborating with us?</p>
                <p>Let's discuss how we can help and</p>
                <p>support your creative needs.</p>
              </div>
            </div>

            <div id="contact-mob" className="contactus-text">
              <p>We'd Love to </p>
              <p>Work With You.</p>
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
                      inputClass="bg-contact form-text border-0 w-100 phone-input"
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
                  placeholder="Add a Message"
                  className="bg-contact form-text border-0"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* ✅ Google reCAPTCHA Section */}
              <div className="mb-4 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev" // ⬅️ Replace this with your reCAPTCHA site key
                  onChange={handleCaptchaChange}
                />
              </div>

              <div className="button-wrapper">
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Sending..." : "Send"}</span>
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

export default Partner;
