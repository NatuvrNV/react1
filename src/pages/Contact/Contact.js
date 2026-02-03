import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("aEASMHR8n6Vmgtj3l"); // Using your actual public key

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

  // Function to send email using EmailJS - UPDATED with from_phone
  const sendEmail = async () => {
    const templateParams = {
      to_name: "Metaguise Team",
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone, // ADDED: This is what your template uses
      phone: formData.phone, // Keep for backward compatibility
      phone_number: formData.phone, // Keep for backward compatibility
      mobile: formData.phone, // Keep for backward compatibility
      message: formData.message || "No message provided",
      timestamp: new Date().toLocaleString(),
      subject: `New Contact Form Inquiry from ${formData.name}`,
      reply_to: formData.email
    };

    console.log("Sending email with params:", templateParams);

    try {
      const response = await emailjs.send(
        "service_hbh6e6a", // Using your service ID
        "template_sp4d06m", // Using your template ID
        templateParams
      );
      console.log("Email sent successfully:", response);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  };

  const createLead = async () => {
    // Get the message from textarea
    const userMessage = formData.message || "No message provided";
    
    // Prepare final payload - all fields null except name, email, phone, message
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
      projectBrief: userMessage, // Store message in projectBrief field
      productCategory: "null",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: userMessage, // Store only the user message
      callRegistration: true,
      leadAssignments: [], // Empty array
      callSource: "CONTACT" // Hardcoded as CONTACT for contact page
    };

    console.log("Creating lead with payload:", payload);
    console.log("User message for backend:", userMessage);

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
        return true;
      } else {
        console.error("Failed to create lead:", responseText);
        return false;
      }
    } catch (err) {
      console.error("Error creating lead:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");

    console.log("Form submission started");
    console.log("Form data:", formData);

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
      // Step 1: Create lead in backend
      console.log("Creating lead via backend API...");
      const leadCreated = await createLead();
      
      // Step 2: Send email via EmailJS
      console.log("Sending email via EmailJS...");
      const emailSent = await sendEmail();
      
      if (leadCreated && emailSent) {
        setFeedbackMessage("✅ Thank you for your inquiry! Our team will connect with you shortly.");
        
        // ✅ Google Ads Conversion Tracking Trigger
        if (typeof window !== "undefined" && window.gtag) {
          console.log("Triggering Google Ads conversion tracking");
          window.gtag("event", "conversion", {
            send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
            call_source: "CONTACT",
          });
        }

        // Reset form
        console.log("Resetting form...");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setCaptchaToken(null);

      } else if (leadCreated && !emailSent) {
        setFeedbackMessage("✅ Thank you for your inquiry! Lead created but email notification failed. Our team will still connect with you.");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setCaptchaToken(null);
      } else {
        setFeedbackMessage("❌ Failed to submit your inquiry. Please try again.");
      }

    } catch (error) {
      console.error("Error in form submission:", error);
      setFeedbackMessage("❌ Something went wrong. Please try again.");
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
                      placeholder="Name *"
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
                      placeholder="Email *"
                      className="bg-contact form-text border-0"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSending}
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
                      placeholder="Phone Number *"
                      dropdownClass="bg-dark text-white"
                      value={formData.phone}
                      onChange={handlePhoneChange}
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
                  placeholder="Tell us more about your Project"
                  className="bg-contact form-text border-0"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSending}
                />
              </Form.Group>

              {/* ✅ Google reCAPTCHA */}
              <div className="d-flex justify-content-start mb-4">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
                  disabled={isSending}
                />
              </div>

              <div className="button-wrapper">
                <button 
                  type="submit" 
                  className="send-button" 
                  disabled={isSending}
                >
                  <span>{isSending ? "Submitting..." : "Submit"}</span>
                </button>
              </div>

              {feedbackMessage && (
                <Alert 
                  variant={
                    feedbackMessage.includes("❌") || feedbackMessage.includes("⚠️") 
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