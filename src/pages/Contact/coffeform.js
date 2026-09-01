import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "@emailjs/browser";

// Initialize EmailJS
emailjs.init("aEASMHR8n6Vmgtj3l");

const Contact = ({ brochureName }) => {
  const location = useLocation();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /*
   * ============================================================
   * NORMALIZE CURRENT URL
   * ============================================================
   *
   * This makes:
   *
   * /ctb
   * /ctb/
   *
   * work as the same route.
   */

  const normalizedPath =
    location.pathname.length > 1
      ? location.pathname.replace(/\/+$/, "")
      : location.pathname;

  /*
   * ============================================================
   * BROCHURE CONFIGURATION
   * ============================================================
   */

  const brochureConfig = {
    "/metasurface": {
      name: "MetaSurface",
      pdf: "/assets/brochure/METASURFACE.pdf",
      callSource: "METASURFACE",
      url: "https://metaguise.com/metasurface/",
    },

    "/metaparametric": {
      name: "MetaParametric",
      pdf: "/assets/brochure/METAPARAMETRIC.pdf",
      callSource: "METAPARAMETRIC",
      url: "https://metaguise.com/metaparametric/",
    },

    "/metaform": {
      name: "MetaForm",
      pdf: "/assets/brochure/METAFORM.pdf",
      callSource: "METAFORM",
      url: "https://metaguise.com/metaform/",
    },

    "/metafunction": {
      name: "MetaFunction",
      pdf: "/assets/brochure/METAFUNCTION.pdf",
      callSource: "METAFUNCTION",
      url: "https://metaguise.com/metafunction/",
    },

    "/ctb": {
      name: "Coffee Table Book",
      pdf: "/assets/brochure/ctb.pdf",
      callSource: "COFFEE_TABLE_BOOK",
      url: "https://metaguise.com/ctb/",
    },
  };

  /*
   * ============================================================
   * H1 / H2 CONFIGURATION (Yash task 5)
   * ============================================================
   *
   * These pages shipped with 0 H1 and 0 H2. This also fixes the
   * duplicate-content pattern: the four brochure pages share one
   * template, so a real H1 (product name) plus an H2 that says
   * what's distinct about that product is what makes each page's
   * content genuinely different, not just the brand name swapped
   * into the same paragraph.
   */

  const headingConfig = {
   "/metasurface": {
      h1: "Browse Metaguise's facade finishes and coatings",
      h2: "Premium Finishes & Coating Systems by Metaguise",
    },
    "/metaparametric": {
      h1: "See how Metaguise turns algorithmic design into buildable metal facades",
      h2: "Algorithmic Facade Design by Metaguise",
    },
    "/metaform": {
      h1: "Discover Metaguise's sculptural metal facade systems",
      h2: "Sculptural Metal Facade Collection by Metaguise",
    },
    "/metafunction": {
      h1: "Explore Metaguise's performance-driven facade systems",
      h2: "Performance-Driven Metal Facade Systems by Metaguise",
    },
    "/ctb": {
      h1: "Explore Metaguise's metal facade products and projects ",
      h2: "Odyssey",
    },
  };

  const currentHeadings =
    headingConfig[normalizedPath] || {
      h1: detectedBrochure,
      h2: "",
    };

  /*
   * ============================================================
   * GET CURRENT BROCHURE CONFIGURATION
   * ============================================================
   */

  const currentConfig = brochureConfig[normalizedPath];

  /*
   * If route exists, use route configuration.
   * Otherwise use brochureName prop.
   */

  const detectedBrochure =
    currentConfig?.name || brochureName || "Unknown";

  const brochurePDF = currentConfig?.pdf || "";

  const callSource =
    currentConfig?.callSource || "CONTACT";

  const canonicalURL =
    currentConfig?.url || "https://metaguise.com/contact/";

  /*
   * ============================================================
   * BREADCRUMB SCHEMA (JSON-LD)
   * ============================================================
   */

  const breadcrumbSchema = currentConfig
    ? {
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
            "name": currentConfig.name,
            "item": canonicalURL
          }
        ]
      }
    : null;

  /*
   * ============================================================
   * FORM STATE
   * ============================================================
   */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `The user has requested the ${detectedBrochure} brochure.`,
  });

  const [isSending, setIsSending] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [captchaValue, setCaptchaValue] = useState(null);

  /*
   * ============================================================
   * UPDATE MESSAGE WHEN BROCHURE CHANGES
   * ============================================================
   */

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      message: `The user has requested the ${detectedBrochure} brochure.`,
    }));
  }, [detectedBrochure]);

  /*
   * ============================================================
   * FORM HANDLERS
   * ============================================================
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  /*
   * ============================================================
   * PHONE PLACEHOLDER
   * ============================================================
   */

  useEffect(() => {
    const inputField = document.querySelector(
      ".contact-right .form-text input"
    );

    if (!inputField) return;

    if (!formData.phone || formData.phone.length <= 3) {
      inputField.setAttribute(
        "placeholder",
        "Enter your mobile number"
      );
    } else {
      inputField.setAttribute("placeholder", "");
    }
  }, [formData.phone]);

  /*
   * ============================================================
   * OPEN BROCHURE PDF
   * ============================================================
   */

  const openPDF = () => {
    if (!brochurePDF) {
      console.error(
        `No PDF configured for ${detectedBrochure}`
      );

      return;
    }

    window.open(
      brochurePDF,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * ============================================================
   * SEND EMAIL USING EMAILJS
   * ============================================================
   */

  const sendEmail = async () => {
    const templateParams = {
      to_name: "Metaguise Team",

      from_name: formData.name,

      from_email: formData.email,

      from_phone: formData.phone,

      phone: formData.phone,

      phone_number: formData.phone,

      mobile: formData.phone,

      brochure_name: detectedBrochure,

      message: formData.message,

      timestamp: new Date().toLocaleString(),

      subject: `New ${detectedBrochure} Brochure Download Request`,

      reply_to: formData.email,
    };

    console.log(
      "Sending EmailJS request:",
      templateParams
    );

    try {
      const response = await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        templateParams
      );

      console.log(
        "EmailJS response:",
        response
      );

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error(
        "EmailJS error:",
        error
      );

      return {
        success: false,
        message: "Failed to send email notification",
      };
    }
  };

  /*
   * ============================================================
   * CREATE LEAD
   * ============================================================
   */

  const createLead = async () => {
    const currentDateTime =
      new Date().toISOString();

    /*
     * Lead assignment
     */

    const leadAssignments = [
      {
        role: "PRE_SALES",

        employeeId:
          "694bbefcf956d21d2f8f2f90",

        employeeName:
          "Kajal Arya",

        assignAt:
          currentDateTime,
      },
    ];

    /*
     * Lead payload
     */

    const payload = {
      firstName:
        formData.name.split(" ")[0] ||
        formData.name,

      fullName:
        formData.name,

      contact:
        formData.phone,

      email:
        formData.email,

      address:
        "null",

      locality:
        "null",

      city:
        "null",

      district:
        "null",

      state:
        "null",

      pincode:
        "000000",

      pincodeMappingId:
        "693f98b3f956d25cedd37dfc",

      projectType:
        "null",

      customerType:
        "null",

      engagementTimeline:
        "null",

      has3dOrSiteDrawings:
        false,

      approximateFacadeCladdingSqFt:
        0,

      projectBrief:
        formData.message,

      productCategory:
        "null",

      productBrand:
        "Metaguise",

      productId:
        "69412167f956d233e1261afc",

      callStatus:
        "NEW_LEAD",

      remarks:
        `Requested ${detectedBrochure} brochure. ` +
        formData.message,

      callRegistration:
        true,

      leadAssignments:
        leadAssignments,

      /*
       * Dynamic call source
       *
       * MetaSurface
       * MetaParametric
       * MetaForm
       * MetaFunction
       * Coffee Table Book
       */

      callSource:
        callSource,
    };

    console.log(
      "Creating lead:",
      payload
    );

    console.log(
      "Call Source:",
      callSource
    );

    try {
      const response = await fetch(
        "https://backend.cshare.in/api/customer/create",
        {
          method: "POST",

          headers: {
            companyId:
              "693f9759f956d25cedd37a6f",

            apikey:
              "918ef419818745ef1f09f705a9642545",

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Lead response:",
        response.status,
        responseText
      );

      if (response.ok) {
        return {
          success: true,

          message:
            "Lead created successfully",
        };
      }

      console.error(
        "Lead creation failed:",
        responseText
      );

      return {
        success: false,

        message:
          "Failed to create lead",
      };
    } catch (error) {
      console.error(
        "Lead API error:",
        error
      );

      return {
        success: false,

        message:
          "Network error creating lead",
      };
    }
  };

  /*
   * ============================================================
   * FORM SUBMISSION
   * ============================================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFeedbackMessage("");

    setIsSending(true);

    /*
     * Required fields
     */

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setFeedbackMessage(
        "❌ All fields are required."
      );

      setIsSending(false);

      return;
    }

    /*
     * Email validation
     */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email
      )
    ) {
      setFeedbackMessage(
        "❌ Please enter a valid email address."
      );

      setIsSending(false);

      return;
    }

    /*
     * Phone validation
     */

    const phoneDigits =
      formData.phone.replace(
        /\D/g,
        ""
      );

    if (
      phoneDigits.length < 10
    ) {
      setFeedbackMessage(
        "❌ Please enter a valid phone number."
      );

      setIsSending(false);

      return;
    }

    /*
     * CAPTCHA validation
     */

    if (!captchaValue) {
      setFeedbackMessage(
        "⚠️ Please verify the reCAPTCHA before submitting."
      );

      setIsSending(false);

      return;
    }

    try {
      /*
       * Open PDF immediately
       */

      openPDF();

      /*
       * Create lead
       */

      const leadResult =
        await createLead();

      /*
       * Send EmailJS notification
       */

      const emailResult =
        await sendEmail();

      /*
       * Success messages
       */

      if (
        leadResult.success &&
        emailResult.success
      ) {
        setFeedbackMessage(
          `✅ Thanks for your query! Your ${detectedBrochure} brochure is ready. Your details have been sent to our team.`
        );
      } else if (
        leadResult.success &&
        !emailResult.success
      ) {
        setFeedbackMessage(
          `✅ Thanks for your query! Your ${detectedBrochure} brochure is ready and your lead has been created.`
        );
      } else if (
        !leadResult.success &&
        emailResult.success
      ) {
        setFeedbackMessage(
          `✅ Thanks for your query! Your ${detectedBrochure} brochure is ready and your request has been emailed to our team.`
        );
      } else {
        setFeedbackMessage(
          `✅ Thanks for your query! Your ${detectedBrochure} brochure is ready.`
        );
      }

      /*
       * Reset form
       */

      setFormData({
        name: "",

        email: "",

        phone: "",

        message:
          `The user has requested the ${detectedBrochure} brochure.`,
      });

      /*
       * Reset CAPTCHA
       */

      setCaptchaValue(null);
    } catch (error) {
      console.error(
        "Form submission error:",
        error
      );

      setFeedbackMessage(
        "❌ Something went wrong. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  /*
   * ============================================================
   * PAGE META DATA
   * ============================================================
   */

  const pageTitle =
    `Download ${detectedBrochure} Brochure | Luxury Metal Facades & Cladding`;

  const pageDescription =
    `Explore our premium ${detectedBrochure} designs. Download the brochure for innovative architectural surfaces.`;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <Helmet>

        <title>
          {pageTitle}
        </title>

        <link
          rel="canonical"
          href={canonicalURL}
        />

        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}

        <meta
          name="description"
          content={pageDescription}
        />

        <meta
          property="og:url"
          content={canonicalURL}
        />

        <meta
          property="og:title"
          content={pageTitle}
        />

        <meta
          property="og:description"
          content={pageDescription}
        />

        <meta
          property="og:type"
          content="website"
        />

      </Helmet>

      <Container
        fluid
        className="bg-dark text-white contact-container"
      >

        <Row className="contact-row">

          {/* LEFT SIDE */}

          <Col
            md={6}
            className="contact-left d-flex flex-column justify-content-center gap-4"
          >

            <h1
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {currentHeadings.h1}
            </h1>

            {currentHeadings.h2 && (
              <h2
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {currentHeadings.h2}
              </h2>
            )}

            <div className="contactus1-text">

              <p>
                Thank you for
              </p>

              <p>
                showing interest in
              </p>

              <p>
                {detectedBrochure} brochure!
              </p>

            </div>

            <div className="lead-contact">

              <p>
                Please fill the form to download it.
              </p>

            </div>

          </Col>

          {/* RIGHT SIDE */}

          <Col
            md={6}
            className="contact-right d-flex flex-column justify-content-center"
          >

            <Form
              className="w-100"
              onSubmit={handleSubmit}
            >

              {/* NAME + EMAIL */}

              <Row>

                <Col
                  md={6}
                  className="mb-3 mb-md-4"
                >

                  <Form.Group
                    controlId="formName"
                  >

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

                <Col
                  md={6}
                  className="mb-3 mb-md-4"
                >

                  <Form.Group
                    controlId="formEmail"
                  >

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

              {/* PHONE */}

              <Row>

                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >

                  <Form.Group
                    controlId="formPhone"
                  >

                    <PhoneInput
                      country="in"
                      enableSearch

                      inputClass="bg-contact form-text border-0 w-100"

                      containerClass="w-100"

                      inputStyle={{
                        width: "100%",
                      }}

                      placeholder="Enter your mobile number"

                      dropdownClass="bg-dark text-white"

                      value={formData.phone}

                      onChange={
                        handlePhoneChange
                      }

                      disabled={isSending}
                    />

                  </Form.Group>

                </Col>

              </Row>

              {/* MESSAGE */}

              <Row>

                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >

                  <Form.Group
                    controlId="formMessage"
                  >

                    <Form.Control
                      as="textarea"
                      rows={3}

                      name="message"

                      placeholder="Message *"

                      className="bg-contact form-text border-0"

                      value={formData.message}

                      onChange={handleChange}

                      required

                      disabled={isSending}
                    />

                  </Form.Group>

                </Col>

              </Row>

              {/* CAPTCHA */}

              <Row>

                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >

                  <div className="d-flex justify-content-center">

                    <ReCAPTCHA
                      sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"

                      onChange={
                        handleCaptchaChange
                      }

                      theme="dark"

                      disabled={isSending}
                    />

                  </div>

                </Col>

              </Row>

              {/* BUTTON */}

              <div className="button-wrapper">

                <button
                  type="submit"
                  className="send-button"
                  disabled={isSending}
                >

                  <span>

                    {isSending
                      ? "Processing..."
                      : `Send & View ${detectedBrochure} Brochure`}

                  </span>

                </button>

              </div>

              {/* FEEDBACK */}

              {feedbackMessage && (

                <Alert
                  variant={
                    feedbackMessage.includes(
                      "❌"
                    ) ||
                    feedbackMessage.includes(
                      "⚠️"
                    )
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