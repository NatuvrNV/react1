import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocation } from "react-router-dom";

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

  const detectedBrochure = pageBrochureMap[location.pathname] || brochureName || "Contact Form";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    squareFeet: "",
    message: location.pathname === "/contact" ? "" : `The user has requested the ${detectedBrochure} brochure.`,
  });

  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

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

  // Fetch employees on component mount for brochure pages
  useEffect(() => {
    if (location.pathname !== "/contact") {
      fetchEmployees();
    }
  }, [location.pathname]);

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

  const parseRange = (rangeString) => {
    if (!rangeString) return { min: 0, max: 0 };
    
    const parts = rangeString.split('-').map(part => parseInt(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    return { min: 0, max: 0 };
  };

  const findMatchingEmployees = (sqft) => {
    const sqftNum = parseInt(sqft);
    if (isNaN(sqftNum)) return [];

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
    // Find matching employees
    const matchedEmployees = findMatchingEmployees(formData.squareFeet);
    
    if (matchedEmployees.length === 0) {
      console.log("No matching employees found for SQFT:", formData.squareFeet);
      return; // Don't create lead if no employee matches
    }

    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Prepare final payload
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
      approximateFacadeCladdingSqFt: parseInt(formData.squareFeet) || 0,
      projectBrief: formData.message,
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `Requested ${detectedBrochure} brochure. ${formData.message}`,
      callRegistration: true,
      leadAssignments: leadAssignments
    };

    console.log("Creating lead with payload:", payload);

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

    // For brochure pages, validate square feet
    if (location.pathname !== "/contact" && (!formData.squareFeet.trim())) {
      setFeedbackMessage("❌ Square Feet Area is required.");
      setIsSending(false);
      return;
    }

    if (location.pathname !== "/contact") {
      const sqftNum = parseInt(formData.squareFeet);
      if (isNaN(sqftNum) || sqftNum <= 0) {
        setFeedbackMessage("❌ Please enter a valid square feet area.");
        setIsSending(false);
        return;
      }
    }

    if (!captchaValue) {
      setFeedbackMessage("⚠️ Please verify the reCAPTCHA.");
      setIsSending(false);
      return;
    }

    try {
      // For brochure pages, handle PDF download and lead creation
      if (location.pathname !== "/contact") {
        // Step 1: Open PDF
        openPDF();
        
        // Step 2: Create lead (if matching employee found)
        const leadCreated = await createLead();
        
        // Step 3: Show success message
        if (leadCreated && showLeadSuccess) {
          setFeedbackMessage("✅ Thanks for your query! Brochure downloaded and our team will connect with you shortly.");
        } else {
          setFeedbackMessage("✅ Thanks for your query! Your download will begin shortly.");
        }
      } else {
        // For contact page, send email
        const emailParams = {
          from_name: formData.name,
          from_email: formData.email,
          from_phone: formData.phone,
          square_feet: formData.squareFeet || "Not specified",
          message: formData.message,
        };

        const response = await emailjs.send(
          "service_hbh6e6a",
          "template_sp4d06m",
          emailParams,
          "aEASMHR8n6Vmgtj3l"
        );

        console.log("Email sent successfully!", response);
        setFeedbackMessage("Thank you for your enquiry. We will get in touch with you soon!");

        // ✅ Google Ads Conversion Tracking
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
          });
        }
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        squareFeet: "",
        message: location.pathname === "/contact" ? "" : `The user has requested the ${detectedBrochure} brochure.`,
      });

      setCaptchaValue(null);

    } catch (error) {
      console.error("Error in form submission:", error);
      if (location.pathname !== "/contact") {
        setFeedbackMessage("❌ Something went wrong. Please try again.");
      } else {
        setFeedbackMessage("Failed to send email. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderLeftContent = () => {
    if (location.pathname === "/contact") {
      return (
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
      );
    } else {
      return (
        <div className="contact-left d-flex flex-column justify-content-center gap-4">
          <div className="contactus1-text">
            <p>Thank you for</p>
            <p>showing interest in</p>
            <p>{detectedBrochure} brochure!</p>
          </div>
          <div className="lead-contact">
            <p>Please fill the form to download it.</p>
          </div>
        </div>
      );
    }
  };

  const renderSubmitButton = () => {
    if (location.pathname === "/contact") {
      return (
        <button type="submit" className="send-button" disabled={isSending}>
          <span>{isSending ? "Sending..." : "Send"}</span>
        </button>
      );
    } else {
      return (
        <button type="submit" className="send-button" disabled={isSending}>
          <span>{isSending ? "Processing..." : `Send & View ${detectedBrochure} Brochure`}</span>
        </button>
      );
    }
  };

  return (
    <>
      <Helmet>
        {location.pathname === "/contact" ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
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
            {renderLeftContent()}
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
                      type="number"
                      name="squareFeet"
                      placeholder="Square Feet Area"
                      className="bg-contact form-text border-0"
                      value={formData.squareFeet}
                      onChange={handleChange}
                      required={location.pathname !== "/contact"}
                      min="1"
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
                  required={location.pathname === "/contact"}
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
                {renderSubmitButton()}
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
