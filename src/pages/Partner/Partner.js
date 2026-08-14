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

// FIX (Yash task 3): no H1 existed on this page — the headline is stacked
// decorative <p> tags. Rather than retype those as <h1> and risk breaking
// the layout (as happened on the product pages), this adds a real but
// visually hidden <h1> using the sr-only pattern the plan specifies for
// the homepage fix. NOT display:none, which Google discounts.
const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

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

  // Function to send email using EmailJS - UPDATED with from_phone
  const sendEmail = async () => {
    const templateParams = {
      to_name: "Metaguise Team",
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone, // ADDED: This is needed for your EmailJS template
      phone: formData.phone,
      phone_number: formData.phone,
      mobile: formData.phone,
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
    // Create current date/time in ISO format for lead assignment
    const currentDateTime = new Date().toISOString();

    // Prepare lead assignments with Kajal Arya's static data
    const leadAssignments = [
      {
        role: "PRE_SALES",
        employeeId: "694bbefcf956d21d2f8f2f90",
        employeeName: "Kajal Arya",
        assignAt: currentDateTime // Using current date and time
      }
    ];

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
      leadAssignments: leadAssignments, // Added lead assignments for Kajal Arya
      callSource: "PARTNER" // Added callSource parameter
    };

    console.log("Creating partner lead with payload:", payload);
    console.log("Lead assignments:", leadAssignments);

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

    // Validate all required fields (name, email, phone, message)
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFeedbackMessage("❌ All fields are required.");
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

      // Step 2: Create lead in backend with Kajal Arya assignment
      const leadResult = await createLead();

      // Step 3: Show success message based on results
      if (leadResult.success && emailResult.success) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! We'll connect with you shortly.");
      } else if (leadResult.success && !emailResult.success) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! Email notification failed.");
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
        <title>Partner With Metaguise | Architect & Builder Facade Partnerships</title>
        <meta
          name="description"
          content="Partner with Metaguise for metal facade and cladding projects. Trade pricing, technical support and priority delivery for architects, builders and developers."
        />
        <meta property="og:title" content="Partner With Metaguise | Architect & Builder Facade Partnerships" />
        <meta
          property="og:description"
          content="Partner with Metaguise for metal facade and cladding projects. Trade pricing, technical support and priority delivery for architects, builders and developers."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/partner/" />
        <meta name="keywords" content="facade partner program, architect facade partnership india" />

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
            {/* FIX (Yash task 3): the page's single H1. Rendered once here,
                outside the desktop/mobile split below, so it's never
                duplicated regardless of viewport. Visually hidden — the
                decorative headline underneath is unchanged. */}
            <h1 style={srOnlyStyle}>Partner With Metaguise</h1>
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
                      placeholder="Phone Number *"
                      required
                      disabled={isSending}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Message field */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <Form.Group controlId="formMessage">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      placeholder="Add a Message *"
                      className="bg-contact form-text border-0"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSending}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ✅ Google reCAPTCHA Section */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <div className="d-flex justify-content-center">
                    <ReCAPTCHA
                      sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                      onChange={handleCaptchaChange}
                      theme="dark"
                      disabled={isSending}
                    />
                  </div>

                </Col>
              </Row>

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

      {/* ============================================================
          Hub/content copy for the partner page (Rishi task 9).
          /partner/ was 127 words, 0 H2 — this section is the fix.
          Copy below is Rishi's, delivered 13 Aug. Only 3 H2s vs the
          4-6 his own sheet calls for — worth flagging back to him,
          not something to pad out on your own.
         ============================================================ */}
      {/*
        ⚠️ NOTE: this section is now visually hidden via srOnlyStyle at the
        user's explicit request, after being warned this is different from
        the sr-only H1 above (which duplicates already-visible copy) — this
        hides genuinely new content that no visitor ever sees, which
        Google's Spam Policies classify as "hidden text" and can penalize.
        This content was originally added (Rishi, task 9) specifically to
        raise the page's VISIBLE word count for the Content/On-page score
        pillars; hiding it undoes that intent. Revert by removing
        `style={srOnlyStyle}` below if this causes ranking issues.
      */}
      <Container as="section" className="partner-copy py-5" style={srOnlyStyle}>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              We'd love to work with you. Interested in collaborating with
              us? Let's discuss how we can help support your creative needs.
            </p>

            <h2>Who We Partner With</h2>
            <p>
              We work alongside architects, builders, developers, and facade
              contractors on projects of every scale — from single
              residences to landmark commercial builds. Firms like
              Morphogenesis, Studio Lotus, Studio Ardete, and Architect
              Hafeez Contractor already specify our systems.
            </p>

            <h2>What Partners Get</h2>
            <p>
              Trade pricing, direct access to our technical team for design
              support, priority production slots, and a dedicated point of
              contact — so you're not chasing updates on a live project.
            </p>

            <h2>How It Works</h2>
            <p>
              Tell us about your practice and typical project type. We'll
              set you up with partner pricing and technical documentation,
              then support you project-by-project — from spec to site.
            </p>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Partner;