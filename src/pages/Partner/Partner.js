import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import Footer from "../../components/Footer";
import "./Partner.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

// Initialize EmailJS
emailjs.init("aEASMHR8n6Vmgtj3l");

const Partner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
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

  // Function to send email using EmailJS
  const sendEmail = async () => {
    const templateParams = {
      to_name: "Metaguise Team",
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      timestamp: new Date().toLocaleString(),
      subject: "New Partner Inquiry",
      reply_to: formData.email
    };

    console.log("Sending partner email with params:", templateParams);

    try {
      const response = await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        templateParams
      );
      
      console.log("EmailJS response success:", response);
      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      console.error("EmailJS error:", error);
      return { success: false, message: "Failed to send email notification" };
    }
  };

  const createLead = async () => {
    // Prepare final payload for Partner with callSource: "PARTNER"
    const payload = {
      firstName: formData.name.split(' ')[0] || formData.name,
      fullName: formData.name,
      contact: formData.phone,
      email: formData.email,
      address: "null",
      locality: "null",
      city: "null",
      district: "null",
      state: "null",
      pincode: "000000",
      pincodeMappingId: "693f98b3f956d25cedd37dfc",
      projectType: "null",
      customerType: "null",
      engagementTimeline: "null",
      has3dOrSiteDrawings: false,
      approximateFacadeCladdingSqFt: 0,
      projectBrief: formData.message || "Partner inquiry form submission",
      productCategory: "null",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `${formData.message}`,
      callRegistration: true,
      leadAssignments: [], // Empty array
      callSource: "PARTNER" // Added callSource parameter
    };

    console.log("Creating partner lead with payload:", payload);

    try {
      const response = await fetch('https://backend.cshare.in/api/customer/create', {
        method: 'POST',
        headers: {
          'companyId': '693f9759f956d25cedd37a6f',
          'apikey': '918ef419818745ef1f09f705a9642545',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log("Lead creation response:", response.status, responseText);

      if (response.ok) {
        return { success: true, message: "Lead created successfully" };
      } else {
        console.error("Failed to create lead:", responseText);
        return { success: false, message: "Failed to create lead in backend" };
      }
    } catch (err) {
      console.error("Error creating lead:", err);
      return { success: false, message: "Network error creating lead" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");

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

    // Validate phone number
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setFeedbackMessage("❌ Please enter a valid phone number.");
      setIsSending(false);
      return;
    }

    if (!captchaToken) {
      setFeedbackMessage("⚠️ Please complete the CAPTCHA verification.");
      setIsSending(false);
      return;
    }

    try {
      // Step 1: Send email via EmailJS
      const emailResult = await sendEmail();
      
      // Step 2: Create lead in backend
      const leadResult = await createLead();
      
      // Step 3: Show success message based on results
      if (leadResult.success && emailResult.success) {
        setFeedbackMessage("✅ Thank you for your partner inquiry!  We'll connect with you shortly.");
      } else if (leadResult.success && !emailResult.success) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! Email notification failed .");
      } else if (!leadResult.success && emailResult.success) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! The request failed.");
      } else {
        setFeedbackMessage("✅ Thank you for your partner inquiry! The request failed.");
      }

      // ✅ Google Ads Conversion Tracking Trigger
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
          call_source: "PARTNER",
        });
      }

      // Reset form
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        message: "" 
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
                      disabled={isSending}
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
                      disabled={isSending}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Phone number field - full width */}
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
                      disabled={isSending}
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
                  disabled={isSending}
                />
              </Form.Group>

              {/* ✅ Google reCAPTCHA Section */}
              <div className="mb-4 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
                  disabled={isSending}
                />
              </div>

              <div className="button-wrapper">
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Processing..." : "Send"}</span>
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

export default Partner;