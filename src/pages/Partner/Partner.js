import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import Footer from "../../components/Footer";
import "./Partner.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

  useEffect(() => {
    const phoneInputField = document.querySelector(".phone-input input");
    if (phoneInputField) {
      phoneInputField.setAttribute("placeholder", "Enter your Mobile number");
    }
  }, [formData.phone]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

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

  const parseRange = (rangeString) => {
    if (!rangeString) return { min: 0, max: 0 };
    
    const parts = rangeString.split('-').map(part => parseInt(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    return { min: 0, max: 0 };
  };

  const findMatchingEmployees = () => {
    // Use default value of 5000 since square feet is removed
    const sqftNum = 5000;
    
    const matchingEmployees = employees.filter(emp => {
      const range = parseRange(emp.employeeAssignmentRange);
      return sqftNum >= range.min && sqftNum <= range.max;
    });

    return matchingEmployees;
  };

  const prepareLeadAssignments = (matchedEmployees) => {
    return matchedEmployees.map(emp => ({
      role: "PRE_SALES",
      employeeId: emp.id,
      employeeName: emp.fullName
    }));
  };

  const createLead = async () => {
    // Find matching employees with default value
    const matchedEmployees = findMatchingEmployees();
    
    if (matchedEmployees.length === 0) {
      console.log("No matching employees found for default SQFT value");
      return false;
    }

    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Prepare final payload for Partner
    const payload = {
      firstName: formData.name.split(' ')[0] || formData.name,
      fullName: formData.name,
      contact: formData.phone,
      email: formData.email,
      address: "Gurugram, Haryana",
      locality: "DLF QE",
      city: "Gurgaon(HR)",
      district: "Gurgaon",
      state: "HARYANA",
      pincode: "122002",
      pincodeMappingId: "693f98b3f956d25cedd37dfc",
      projectType: "RESIDENTIAL",
      customerType: "END_USER",
      engagementTimeline: "IMMEDIATE",
      has3dOrSiteDrawings: true,
      approximateFacadeCladdingSqFt: 5000, // Default value
      projectBrief: formData.message || "Partner inquiry form submission",
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `Partner inquiry. ${formData.message}`,
      callRegistration: true,
      leadAssignments: leadAssignments
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
        setShowLeadSuccess(true);
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

  const sendEmail = async () => {
    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      message: formData.message || "Partner inquiry",
    };

    try {
      await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        emailParams,
        "aEASMHR8n6Vmgtj3l"
      );
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
    setShowLeadSuccess(false);

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
      // Send email
      const emailSent = await sendEmail();
      
      // Create lead in backend
      const leadCreated = await createLead();
      
      // Show appropriate success message
      if (leadCreated && showLeadSuccess) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! Our team will connect with you shortly.");
      } else if (emailSent) {
        setFeedbackMessage("✅ Thank you for your partner inquiry! We will get in touch with you soon.");
      } else {
        setFeedbackMessage("✅ Thank you for your inquiry!");
      }

      // ✅ Google Ads Conversion Tracking Trigger
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
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
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
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
