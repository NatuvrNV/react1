import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

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
    squareFeet: "", // Added back square feet field
    message: `The user has requested the ${detectedBrochure} brochure.`,
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

  // Fetch employees on component mount
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
    // Find matching employees based on square feet
    const sqftNum = parseInt(formData.squareFeet) || 0;
    const matchedEmployees = findMatchingEmployees(sqftNum);
    
    if (matchedEmployees.length === 0) {
      console.log("No matching employees found for SQFT:", formData.squareFeet);
      return false;
    }

    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Determine callSource based on detectedBrochure
    let callSource = "CONTACT"; // default
    
    if (detectedBrochure) {
      const brochureToCallSource = {
        "MetaSurface": "METASURFACE",
        "MetaParametric": "METAPARAMETRIC",
        "MetaForm": "METAFORM",
        "MetaFunction": "METAFUNCTION",
        "Coffee Table Book": "CONTACT" // Default for CTB
      };
      
      callSource = brochureToCallSource[detectedBrochure] || "CONTACT";
    }

    // Prepare final payload with all parameters
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
      leadAssignments: leadAssignments,
      callSource: callSource // Added callSource parameter
    };

    console.log("Creating lead with payload:", payload);
    console.log("callSource determined as:", callSource);

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

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFeedbackMessage("");
    setShowLeadSuccess(false);

    // Validate all required fields including square feet
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.squareFeet.trim()) {
      setFeedbackMessage("❌ All fields are required.");
      setIsSending(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFeedbackMessage("❌ Please enter a valid email address.");
      setIsSending(false);
      return;
    }

    const sqftNum = parseInt(formData.squareFeet);
    if (isNaN(sqftNum) || sqftNum <= 0) {
      setFeedbackMessage("❌ Please enter a valid square feet area.");
      setIsSending(false);
      return;
    }

    if (!captchaValue) {
      setFeedbackMessage("⚠️ Please verify the reCAPTCHA before submitting.");
      setIsSending(false);
      return;
    }

    try {
      openPDF();
      
      const leadCreated = await createLead();
      
      if (leadCreated && showLeadSuccess) {
        setFeedbackMessage("✅ Thanks for your query! Brochure downloaded and our team will connect with you shortly.");
      } else {
        setFeedbackMessage("✅ Thanks for your query! Your download will begin shortly.");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        squareFeet: "",
        message: `The user has requested the ${detectedBrochure} brochure.`,
      });
      
      setCaptchaValue(null);
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

              {/* Phone number field */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
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
              </Row>

              {/* Square Feet Area field - Added back */}
              <Row>
                <Col md={12} className="mb-3 mb-md-4">
                  <Form.Group controlId="formSquareFeet">
                    <Form.Control
                      type="number"
                      name="squareFeet"
                      placeholder="Approximate Square Feet Area"
                      className="bg-contact form-text border-0"
                      value={formData.squareFeet}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-3 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>

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