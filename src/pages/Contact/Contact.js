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

// FIX (Yash task 3): no H1 existed on this page — the headline is stacked
// decorative <p> tags. Rather than retype those as <h1> and risk breaking
// the layout (as happened on the product pages), this adds a real but
// visually hidden <h1> using the sr-only pattern the plan itself specifies
// for the homepage fix. NOT display:none, which Google discounts.
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://metaguise.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Contact Us",
      "item": "https://metaguise.com/contact/"
    }
  ]
};

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

    // Create current date/time in ISO format
    const currentDateTime = new Date().toISOString();

    // Prepare lead assignments with static data
    const leadAssignments = [
      {
        role: "PRE_SALES",
        employeeId: "694bbefcf956d21d2f8f2f90",
        employeeName: "Kajal Arya",
        assignAt: currentDateTime // Using current date and time
      }
    ];

    // Prepare final payload
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
      leadAssignments: leadAssignments, // Updated with static data + current date
      callSource: "CONTACT" // Hardcoded as CONTACT for contact page
    };

    console.log("Creating lead with payload:", payload);
    console.log("Lead assignments:", leadAssignments);
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
        setFeedbackMessage("✅ Thank you for your inquiry! Our team will still connect with you.");

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
                <meta name="keywords" content="contact metaguise, metal facade consultation" />

        <meta
          property="og:title"
          content="Contact Metaguise | Metal Facade Cladding Experts"
        />
        <meta
          property="og:description"
          content="Get in touch with Metaguise for expert guidance on metal facade systems and custom facade cladding for your project."
        />
        <link rel="canonical" href="https://metaguise.com/contact/" />
        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

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
            {/* FIX (Yash task 3): the page's single H1. Rendered once here,
                outside the desktop/mobile split below, so it's never
                duplicated regardless of viewport. Visually hidden — the
                decorative headline underneath is unchanged. */}
            <h1 style={srOnlyStyle}>Contact Metaguise</h1>
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

              {/* Message field */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <Form.Group controlId="formMessage">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      placeholder="Tell us more about your Project *"
                      className="bg-contact form-text border-0"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSending}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ✅ Google reCAPTCHA */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <div className="d-flex justify-content-start">
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

      {/* ============================================================
          Hub/content copy for the contact page (Rishi task 9).
          /contact/ was 117 words, 0 H2 — this section is the fix.
          Copy below is Rishi's, delivered 13 Aug. Sits below the
          form/Container on a light background, same reasoning as
          before: the form section above is bg-dark, and this much
          body copy in white-on-dark is a readability problem.
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
      <Container as="section" className="contact-copy py-5" style={srOnlyStyle}>
        <Row>
          <Col lg={8} className="mx-auto">
            <p>
              We'd love to connect with you. Share your vision, and let's
              create something amazing together.
            </p>

            <h2>Get Expert Guidance on Your Facade Project</h2>
            <p>
              Whether you're an architect finalising a design, a developer
              scoping a new build, or a homeowner exploring options, our
              team gives you a straight answer on what's possible — system
              choice, material, finish, and a realistic budget range before
              you commit to anything.
            </p>

            <h2>What Happens After You Reach Out</h2>
            <p>
              We reply within 24 hours. From there it's a short call to
              understand your project, followed by a tailored recommendation
              with visuals and indicative pricing. If it's a good fit, we
              move to site measurements and a formal quote — no pressure,
              no obligation.
            </p>

            <h2>Visit MetaLand by Metaguise, Our Experience Centre</h2>
            <p>
              Prefer to see the material before you decide? Walk through our
              flagship experience centre in Gurugram — VR walkthroughs, live
              finish samples, and real installed panels — or our Kolkata
              centre. Both are open by appointment.
            </p>

            <h2>Talk to Us Directly</h2>
            <p>
              Prefer a call over a form? Reach us at{" "}
              <a
                href="tel:+919811604449"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: "phone_click", link_url: "tel:+919811604449" });
                  }
                }}
              >
                +91 98116 04449
              </a>{" "}
              or{" "}
              <a
                href="mailto:contactus@metaguise.com"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: "email_click", link_url: "mailto:contactus@metaguise.com" });
                  }
                }}
              >
                contactus@metaguise.com
              </a>{" "}
              — same team, faster response.
            </p>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Contact;