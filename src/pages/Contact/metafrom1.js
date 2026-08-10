
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init("aEASMHR8n6Vmgtj3l");

const Contact = ({ brochureName }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /*
   * Normalize URL:
   *
   * /metaform
   * /metaform/
   *
   * Both become:
   *
   * /metaform
   */
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";

  /*
   * Brochure mapping
   */
  const pageBrochureMap = {
    "/metasurface": "MetaSurface",
    "/metaparametric": "MetaParametric",
    "/metaform": "MetaForm",
    "/metafunction": "MetaFunction",
    "/ctb": "Coffee Table Book",
  };

  const detectedBrochure =
    pageBrochureMap[currentPath] || brochureName || "Unknown";

  /*
   * Form state
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `The user has requested the ${detectedBrochure} brochure.`,
  });

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  /*
   * Update message if the brochure/page changes
   */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      message: `The user has requested the ${detectedBrochure} brochure.`,
    }));
  }, [detectedBrochure]);

  /*
   * Handle normal input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
   * Handle phone input
   */
  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  /*
   * Handle reCAPTCHA
   */
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  /*
   * Phone placeholder
   */
  useEffect(() => {
    const inputField = document.querySelector(".form-text input");

    if (inputField) {
      if (!formData.phone || formData.phone.length <= 3) {
        inputField.setAttribute(
          "placeholder",
          "Enter your mobile number"
        );
      } else {
        inputField.setAttribute("placeholder", "");
      }
    }
  }, [formData.phone]);

  /*
   * Open brochure PDF
   */
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

  /*
   * Get call source based on normalized URL
   */
  const getCallSource = () => {
    const pathToCallSource = {
      "/metasurface": "METASURFACE",
      "/metaparametric": "METAPARAMETRIC",
      "/metaform": "METAFORM",
      "/metafunction": "METAFUNCTION",
      "/ctb": "COFFEE_TABLE_BOOK",
      "/contact": "CONTACT",
      "/partner": "PARTNER",
      "/build": "BUILD",
    };

    return pathToCallSource[currentPath] || "CONTACT";
  };

  /*
   * Validate phone number
   */
  const validatePhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");

    return digitsOnly.length >= 10;
  };

  /*
   * Send email using EmailJS
   */
  const sendEmail = async () => {
    const phoneNumber = formData.phone || "";

    const templateParams = {
      to_name: "Metaguise Team",
      from_name: formData.name,
      from_email: formData.email,
      from_phone: phoneNumber,
      phone: phoneNumber,
      phone_number: phoneNumber,
      mobile: phoneNumber,
      brochure_name: detectedBrochure,
      message: formData.message,
      timestamp: new Date().toLocaleString(),
      subject: `New ${detectedBrochure} Brochure Download Request`,
      reply_to: formData.email,
    };

    console.log("Sending email with params:", templateParams);

    try {
      const response = await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        templateParams
      );

      console.log("EmailJS response success:", response);

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("EmailJS error:", error);

      return {
        success: false,
        message: "Failed to send email notification",
      };
    }
  };

  /*
   * Create lead
   */
  const createLead = async () => {
    const callSource = getCallSource();

    const cleanPhone = formData.phone
      ? formData.phone
          .replace(/\s+/g, "")
          .replace(/-/g, "")
      : "";

    const currentDateTime = new Date().toISOString();

    const leadAssignments = [
      {
        role: "PRE_SALES",
        employeeId: "694bbefcf956d21d2f8f2f90",
        employeeName: "Kajal Arya",
        assignAt: currentDateTime,
      },
    ];

    const payload = {
      firstName:
        formData.name.split(" ")[0] || formData.name,

      fullName: formData.name,

      contact: cleanPhone,

      email: formData.email,

      address: "null",
      locality: "null",
      city: "null",
      district: "null",
      state: "null",
      pincode: "000000",

      pincodeMappingId:
        "693f98b3f956d25cedd37dfc",

      projectType: "null",
      customerType: "null",
      engagementTimeline: "null",

      has3dOrSiteDrawings: "null",

      approximateFacadeCladdingSqFt: 0,

      projectBrief: formData.message,

      productCategory: "null",

      productBrand: "Metaguise",

      productId:
        "69412167f956d233e1261afc",

      callStatus: "NEW_LEAD",

      remarks: `Requested ${detectedBrochure} brochure. ${formData.message}`,

      callRegistration: true,

      leadAssignments: leadAssignments,

      callSource: callSource,
    };

    console.log("Creating lead with payload:", payload);
    console.log("callSource:", callSource);
    console.log("Phone:", cleanPhone);

    try {
      const response = await fetch(
        "https://backend.cshare.in/api/customer/create",
        {
          method: "POST",

          headers: {
            companyId: "693f9759f956d25cedd37a6f",
            apikey:
              "918ef419818745ef1f09f705a9642545",
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      console.log(
        "Lead creation response:",
        response.status,
        responseText
      );

      if (response.ok) {
        return {
          success: true,
          message: "Lead created successfully",
        };
      }

      console.error(
        "Failed to create lead:",
        responseText
      );

      return {
        success: false,
        message: "Failed to create lead in backend",
      };
    } catch (err) {
      console.error(
        "Error creating lead:",
        err
      );

      return {
        success: false,
        message: "Network error creating lead",
      };
    }
  };

  /*
   * Submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSending(true);
    setFeedbackMessage("");

    /*
     * Required fields
     */
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setFeedbackMessage(
        "❌ All fields are required."
      );

      setIsSending(false);
      return;
    }

    /*
     * Validate email
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setFeedbackMessage(
        "❌ Please enter a valid email address."
      );

      setIsSending(false);
      return;
    }

    /*
     * Validate phone
     */
    if (!validatePhoneNumber(formData.phone)) {
      setFeedbackMessage(
        "❌ Please enter a valid phone number with country code."
      );

      setIsSending(false);
      return;
    }

    /*
     * Validate captcha
     */
    if (!captchaValue) {
      setFeedbackMessage(
        "⚠️ Please verify the reCAPTCHA."
      );

      setIsSending(false);
      return;
    }

    try {
      /*
       * Step 1
       * Open PDF
       */
      openPDF();

      /*
       * Step 2
       * Create lead
       */
      const leadResult = await createLead();

      /*
       * Step 3
       * Send email
       */
      const emailResult = await sendEmail();

      /*
       * Step 4
       * Show feedback
       */
      if (
        leadResult.success &&
        emailResult.success
      ) {
        setFeedbackMessage(
          "✅ Thanks for your query! Your Metaguise Brochure Download is ready!"
        );
      } else if (
        leadResult.success &&
        !emailResult.success
      ) {
        setFeedbackMessage(
          "✅ Thanks for your query! Brochure downloaded and lead created. Email notification failed."
        );
      } else if (
        !leadResult.success &&
        emailResult.success
      ) {
        setFeedbackMessage(
          "✅ Thanks for your query! Brochure downloaded and email sent. The request failed."
        );
      } else {
        setFeedbackMessage(
          "✅ Thanks for your query! Your Metaguise Brochure downloaded. The request failed."
        );
      }

      /*
       * Reset form
       */
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `The user has requested the ${detectedBrochure} brochure.`,
      });

      setCaptchaValue(null);
    } catch (error) {
      console.error(
        "Error in form submission:",
        error
      );

      setFeedbackMessage(
        "❌ Something went wrong. Please try again."
      );
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

        {/*
         * IMPORTANT:
         * The canonical URL always has /
         *
         * Example:
         * /metaform/
         * /metasurface/
         * /metafunction/
         * /ctb/
         */}
        <link
          rel="canonical"
          href={`https://metaguise.com${currentPath}/`}
        />

        <meta
          name="description"
          content={`Explore our premium ${detectedBrochure} designs. Download the brochure for innovative architectural surfaces.`}
        />

        <meta
          property="og:url"
          content={`https://metaguise.com${currentPath}/`}
        />

        <meta
          property="og:title"
          content={`Download ${detectedBrochure} Brochure | Luxury Metal Facades & Cladding`}
        />

        <meta
          property="og:description"
          content={`Explore our premium ${detectedBrochure} designs. Download the brochure for innovative architectural surfaces.`}
        />
      </Helmet>

      <Container
        fluid
        className="bg-dark text-white contact-container"
      >
        <Row className="contact-row">

          <Col
            md={6}
            className="contact-left d-flex flex-column justify-content-center gap-4"
          >
            <div className="contactus1-text">
              <p>Thank you for</p>

              <p>showing interest in</p>

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

          <Col
            md={6}
            className="contact-right d-flex flex-column justify-content-center"
          >
            <Form
              className="w-100"
              onSubmit={handleSubmit}
            >

              {/* Name + Email */}
              <Row>

                <Col
                  md={6}
                  className="mb-3 mb-md-4"
                >
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

                <Col
                  md={6}
                  className="mb-3 mb-md-4"
                >
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

              {/* Phone */}
              <Row>
                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >
                  <Form.Group controlId="formPhone">

                    <PhoneInput
                      enableSearch
                      inputClass="bg-contact form-text border-0 w-100"
                      containerClass="w-100"
                      inputStyle={{
                        width: "100%",
                      }}
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

              {/* reCAPTCHA */}
              <Row>
                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >
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

              {/* Message */}
              <Row>
                <Col
                  md={12}
                  className="mb-3 mb-md-4"
                >
                  <Form.Group controlId="formMessage">

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

              {/* Submit */}
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

              {/* Feedback */}
              {feedbackMessage && (
                <Alert
                  variant={
                    feedbackMessage.includes("❌") ||
                    feedbackMessage.includes("⚠️")
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

