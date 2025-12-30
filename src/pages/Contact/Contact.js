import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Square feet options for dropdown
  const squareFeetOptions = [
    { value: "", label: "Select Area Range" },
    { value: "0-1000", label: "Under 1,000 Sq ft" },
    { value: "1000-3000", label: "1,000-3,000 Sq ft" },
    { value: "3000-10000", label: "3,000-10,000 Sq ft" },
    { value: "10000+", label: "Over 10,000 Sq ft" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    squareFeet: "",
    message: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Update phone input placeholder
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

  const sendEmail = async () => {
    // Get the display label for square feet
    const squareFeetLabel = formData.squareFeet 
      ? squareFeetOptions.find(opt => opt.value === formData.squareFeet)?.label 
      : "Not specified";

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      square_feet: squareFeetLabel,
      message: formData.message || "Contact inquiry",
      project_area: formData.squareFeet, // Add the raw value as well if needed
    };

    try {
      await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        emailParams,
        "aEASMHR8n6Vmgtj3l"
      );
      console.log("Email sent successfully via EmailJS");
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");

    console.log("Form submission started");

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFeedbackMessage("❌ Name, Email and Phone are required.");
      setIsSending(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFeedbackMessage("❌ Please enter a valid email address.");
      setIsSending(false);
      return;
    }

    if (!captchaToken) {
      setFeedbackMessage("⚠️ Please complete the CAPTCHA verification.");
      setIsSending(false);
      return;
    }

    try {
      // Send email via EmailJS
      console.log("Sending email via EmailJS...");
      const emailSent = await sendEmail();
      
      if (emailSent) {
        setFeedbackMessage("✅ Thank you for your inquiry! We will get in touch with you soon.");
        
        // ✅ Google Ads Conversion Tracking Trigger
        if (typeof window !== "undefined" && window.gtag) {
          console.log("Triggering Google Ads conversion tracking");
          window.gtag("event", "conversion", {
            send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
          });
        }
      } else {
        setFeedbackMessage("❌ Failed to send email. Please try again.");
        setIsSending(false);
        return;
      }

      // Reset form
      console.log("Resetting form...");
      setFormData({
        name: "",
        email: "",
        phone: "",
        squareFeet: "",
        message: "",
      });
      setCaptchaToken(null);

    } catch (error) {
      console.error("Error in form submission:", error);
      setFeedbackMessage("❌ Failed to submit form. Please try again.");
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
        <link rel="canonical" href="https://metaguise.com/contact" />
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
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col
            md={6}
            className="d-flex flex-column justify-content-center"
          >
            <div className="contact-left d-flex align-items-center justify-content-center gap-4">
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
                <Col md={6} className="mb-3 mb-md-4">
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
                <Col md={6} className="mb-3 mb-md-4">
                  <Form.Group controlId="formSquareFeet">
                    <Form.Control
                      as="select"
                      name="squareFeet"
                      value={formData.squareFeet}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                    >
                      {squareFeetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
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
                />
              </Form.Group>

              {/* ✅ Google reCAPTCHA */}
              <div className="d-flex justify-content-start mb-4">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>

              <div className="button-wrapper">
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Sending..." : "Send"}</span>
                </button>
              </div>

              {feedbackMessage && (
                <Alert 
                  variant={
                    feedbackMessage.includes("❌") || feedbackMessage.includes("⚠️") || feedbackMessage.includes("Failed") 
                      ? "danger" 
                      : "success"
                  } 
                  className="mt-3 text-center"
                >
                  {feedbackMessage}
                </Alert>
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
