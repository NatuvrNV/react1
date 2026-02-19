import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("aEASMHR8n6Vmgtj3l");

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

  const detectedBrochure = pageBrochureMap[location.pathname] || brochureName || "Unknown";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `The user has requested the ${detectedBrochure} brochure.`,
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false); // NEW: Terms agreement state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
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

  // Fetch employees on component mount (simplified - no longer needed for matching)
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend.cshare.in/api/genericEmployee/genericEmployeeFilter?roles=PRE_SALES&statuses=ACTIVE&page=0&size=1000', {
        method: 'PUT',
        headers: {
          'companyId': '693f9759f956d25cedd37a6f',
          'apiKey': '918ef419818745ef1f09f705a9642545',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      if (data.object && data.object.content) {
        setEmployees(data.object.content);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
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

  // Function to send email using EmailJS - UPDATED with from_phone
  const sendEmail = async () => {
    const templateParams = {
      to_name: "Metaguise Team",
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone, // ADDED for your EmailJS template
      phone: formData.phone, // Keep for backward compatibility
      phone_number: formData.phone, // Keep for backward compatibility
      mobile: formData.phone, // Keep for backward compatibility
      brochure_name: detectedBrochure,
      message: formData.message,
      timestamp: new Date().toLocaleString(),
      subject: `New ${detectedBrochure} Brochure Download Request`,
      reply_to: formData.email
    };

    console.log("Sending email with params:", templateParams);

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
    // Determine callSource based on detectedBrochure
    let callSource = "CONTACT"; // default
    
    if (detectedBrochure) {
      const brochureToCallSource = {
        "MetaSurface": "METASURFACE",
        "MetaParametric": "METAPARAMETRIC",
        "MetaForm": "METAFORM",
        "MetaFunction": "METAFUNCTION",
        "Coffee Table Book": "COFFEE TABLE BOOK"
      };
      
      callSource = brochureToCallSource[detectedBrochure] || "CONTACT";
    }

    // Prepare final payload - all fields null except name, email, phone
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
      projectBrief: formData.message,
      productCategory: "null",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `Requested ${detectedBrochure} brochure. ${formData.message}`,
      callRegistration: true,
      leadAssignments: [], // Empty array - no employee matching without square feet
      callSource: callSource // CHANGED: Now using dynamic callSource instead of hardcoded "METASURFACE"
    };

    console.log("Creating lead with payload:", payload);
    console.log("callSource value:", callSource);

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
        setShowLeadSuccess(true);
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

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");
    setShowLeadSuccess(false);

    // Validate all required fields (name, email, phone, message, terms)
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFeedbackMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    // Validate terms agreement
    if (!agreeTerms) {
      setFeedbackMessage("❌ Please agree to the Terms & Conditions and Privacy Policy.");
      setIsSending(false);
      return;
    }

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

    if (!captchaValue) {
      setFeedbackMessage("⚠️ Please verify the reCAPTCHA before submitting.");
      setIsSending(false);
      return;
    }

    try {
      // Step 1: Open PDF
      openPDF();
      
      // Step 2: Create lead in backend
      const leadResult = await createLead();
      
      // Step 3: Send email notification via EmailJS
      const emailResult = await sendEmail();
      
      // Step 4: Show success/error message
      if (leadResult.success && emailResult.success) {
        setFeedbackMessage("✅ Thanks for your query! Your Metaguise Brochure Download is ready!");
      } else if (leadResult.success && !emailResult.success) {
        setFeedbackMessage("✅ Thanks for your query! Brochure downloaded and lead created. Email notification failed.");
      } else if (!leadResult.success && emailResult.success) {
        setFeedbackMessage("✅ Thanks for your query! Brochure downloaded and email sent. The request failed.");
      } else {
        setFeedbackMessage("✅ Thanks for your query! Your Metaguise Brochure downloaded. The request failed.");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `The user has requested the ${detectedBrochure} brochure.`,
      });
      
      setCaptchaValue(null);
      setAgreeTerms(false); // Reset terms agreement
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
              <p>{detectedBrochure} brochure!</p>
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

              {/* Phone number field */}
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

              {/* Message field - NEW: Added as required */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
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

              {/* reCAPTCHA */}
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

              {feedbackMessage && (
                <Alert 
                  variant={feedbackMessage.includes("❌") || feedbackMessage.includes("⚠️") ? "danger" : "success"} 
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