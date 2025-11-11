import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import captcha

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
  const [captchaValue, setCaptchaValue] = useState(null); // ✅ Captcha state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
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

    // ✅ Check for required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setFeedbackMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    // ✅ Check captcha
    if (!captchaValue) {
      setFeedbackMessage("❌ Please verify the captcha before submitting.");
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
      setFeedbackMessage(
        "Thank you for your enquiry. We will get in touch with you soon!"
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      setCaptchaValue(null); // ✅ Reset captcha

      // ✅ Google Ads Conversion Tracking
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
        });
      }
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
        <title>Contact Metaguise | Metal Facade Cladding Experts</title>
        <meta
          name="description"
          content="Get in touch with Metaguise for expert guidance on metal facade systems and custom facade cladding for your project."
        />
        <meta
          property="og:title"
          content="Contact Metaguise | Metal Facade Cladding Experts"
        />
        <meta
          property="og:description"
          content="Get in touch with Metaguise for expert guidance on metal facade systems and custom facade cladding for your project."
        />
        <meta name="robots" content="index, follow" />

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

        <link rel="canonical" href="https://metaguise.com/contact" />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col
            md={6}
            className="contact-left d-flex align-items-center justify-content-center gap-4"
          >
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

              {/* ✅ Google reCAPTCHA */}
              <div className="d-flex justify-content-start mb-4">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                />
              </div>

              <div className="button-wrapper">
                <button
                  type="submit"
                  className="send-button"
                  disabled={isSending}
                >
                  <span>{isSending ? "Sending..." : "Send"}</span>
                </button>
              </div>

              {feedbackMessage && (
                <p
                  className={`mt-3 ${
                    feedbackMessage.includes("Thank you")
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
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
