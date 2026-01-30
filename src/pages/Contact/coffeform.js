import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const LeadForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    squareFeet: "",
    remarks: "",
  });

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "success", "error", "warning"
  const [captchaToken, setCaptchaToken] = useState(null);
  
  // Employees state
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, contact: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Function to get callSource based on URL path
  const getCallSource = () => {
    const pathToCallSource = {
      "/build": "BUILD",
      "/metaform": "METAFORM",
      "/metafunction": "METAFUNCTION",
      "/metaparametric": "METAPARAMETRIC",
      "/metasurface": "METASURFACE",
      "/contact": "CONTACT",
      "/partner": "PARTNER"
    };

    return pathToCallSource[location.pathname] || "CONTACT";
  };

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      setEmployeesError("");
      
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
          console.log("Employees fetched:", data.object.content.length);
        } else {
          setEmployeesError("No employees found");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployeesError("Failed to load employees. Please refresh the page.");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // Parse range string like "30-40" to {min: 30, max: 40}
  const parseRange = (rangeString) => {
    if (!rangeString || rangeString.trim() === "") {
      return { min: 0, max: 0 };
    }
    
    const parts = rangeString.split('-').map(part => parseInt(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    return { min: 0, max: 0 };
  };

  // Find matching employees based on square feet
  const findMatchingEmployees = (sqft) => {
    const sqftNum = parseInt(sqft);
    if (isNaN(sqftNum)) return [];

    console.log("Looking for employees matching SQFT:", sqftNum);
    
    const matchingEmployees = employees.filter(emp => {
      const range = parseRange(emp.employeeAssignmentRange);
      console.log(`Employee ${emp.fullName}: range ${range.min}-${range.max}, checking ${sqftNum}`);
      return sqftNum >= range.min && sqftNum <= range.max;
    });

    console.log("Matching employees found:", matchingEmployees.length);
    return matchingEmployees;
  };

  // Prepare lead assignments from matched employees
  const prepareLeadAssignments = (matchedEmployees) => {
    return matchedEmployees.map(emp => ({
      role: "PRE_SALES",
      employeeId: emp.id,
      employeeName: emp.fullName
    }));
  };

  const createLead = async (matchedEmployees, sqft) => {
    // Get callSource value
    const callSource = getCallSource();
    
    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Prepare final payload
    const payload = {
      // Dynamic fields from form
      firstName: formData.fullName.split(' ')[0] || formData.fullName,
      fullName: formData.fullName,
      contact: formData.contact,
      email: formData.email,
      approximateFacadeCladdingSqFt: parseInt(sqft) || 0,
      remarks: formData.remarks || `User submitted form via ${location.pathname}`,
      leadAssignments: leadAssignments,
      callSource: callSource, // Added callSource parameter

      // Static fields (always same)
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
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      callRegistration: true,
      projectBrief: "User submitted lead form"
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
    setFeedbackType("");

    // Step 1: Validate form
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.contact.trim() || !formData.squareFeet.trim()) {
      setFeedbackMessage("❌ All fields are required.");
      setFeedbackType("error");
      setIsSending(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFeedbackMessage("❌ Please enter a valid email address.");
      setFeedbackType("error");
      setIsSending(false);
      return;
    }

    // Validate phone number
    if (formData.contact.replace(/\D/g, '').length < 10) {
      setFeedbackMessage("❌ Please enter a valid phone number.");
      setFeedbackType("error");
      setIsSending(false);
      return;
    }

    // Validate square feet
    const sqftNum = parseInt(formData.squareFeet);
    if (isNaN(sqftNum) || sqftNum <= 0) {
      setFeedbackMessage("❌ Please enter a valid square feet area.");
      setFeedbackType("error");
      setIsSending(false);
      return;
    }

    if (!captchaToken) {
      setFeedbackMessage("⚠️ Please verify the reCAPTCHA.");
      setFeedbackType("warning");
      setIsSending(false);
      return;
    }

    // Step 2: Fetch sqft and match employees
    const matchedEmployees = findMatchingEmployees(formData.squareFeet);
    
    // Step 3: Check if employees matched
    if (matchedEmployees.length === 0) {
      setFeedbackMessage("❌ No suitable employee found for this SQFT range. Please try a different value.");
      setFeedbackType("warning");
      setIsSending(false);
      return;
    }

    console.log("Matched employees:", matchedEmployees);
    console.log("Lead assignments to be created:", prepareLeadAssignments(matchedEmployees));

    try {
      // Step 4: Create lead
      const leadCreated = await createLead(matchedEmployees, formData.squareFeet);
      
      // Step 5: Show success message
      if (leadCreated) {
        setFeedbackMessage("✅ Thanks for your interest in Metaguise, our team will connect with you shortly.");
        setFeedbackType("success");
        
        // Reset form
        setFormData({
          fullName: "",
          contact: "",
          email: "",
          squareFeet: "",
          remarks: "",
        });
        
        setCaptchaToken(null);
        
        // Refresh page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setFeedbackMessage("❌ Failed to create lead. Please try again.");
        setFeedbackType("error");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setFeedbackMessage("❌ Something went wrong. Please try again.");
      setFeedbackType("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Metaguise | Submit Your Project Details</title>
        <meta
          name="description"
          content="Submit your project details to get connected with our team for premium metal facade solutions."
        />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3">Submit Your Project Details</h1>
              <p className="lead">
                Fill in your project details and our team will connect with you shortly.
              </p>
            </div>

            {loadingEmployees && (
              <Alert variant="info" className="text-center">
                <span className="spinner-border spinner-border-sm me-2"></span>
                Loading available team members...
              </Alert>
            )}

            {employeesError && (
              <Alert variant="danger" className="text-center">
                {employeesError}
              </Alert>
            )}

            <div className="contact-form-card p-4 p-md-5 rounded-3 shadow-lg">
              <Form onSubmit={handleSubmit}>
                {/* Full Name */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-medium">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="bg-dark text-white border-secondary form-control-lg"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isSending}
                  />
                </Form.Group>

                {/* Contact */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-medium">Contact Number *</Form.Label>
                  <PhoneInput
                    country={"in"}
                    value={formData.contact}
                    onChange={handlePhoneChange}
                    inputClass="bg-dark text-white border-secondary w-100"
                    containerClass="w-100"
                    inputStyle={{
                      padding: "0.75rem",
                      fontSize: "1rem",
                      backgroundColor: "#212529",
                      color: "white",
                      borderColor: "#6c757d"
                    }}
                    placeholder="Enter your phone number"
                    required
                    disabled={isSending}
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-medium">Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="bg-dark text-white border-secondary form-control-lg"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSending}
                  />
                </Form.Group>

                {/* Square Feet */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-medium">Approximate Square Feet *</Form.Label>
                  <Form.Control
                    type="number"
                    name="squareFeet"
                    placeholder="Enter approximate square feet area"
                    className="bg-dark text-white border-secondary form-control-lg"
                    value={formData.squareFeet}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={isSending}
                  />
                  <Form.Text className="text-muted">
                    This helps us assign the right team member for your project
                  </Form.Text>
                </Form.Group>

                {/* Remarks */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-medium">Remarks (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="remarks"
                    placeholder="Any additional details about your project..."
                    className="bg-dark text-white border-secondary form-control-lg"
                    value={formData.remarks}
                    onChange={handleChange}
                    disabled={isSending}
                  />
                </Form.Group>

                {/* reCAPTCHA */}
                <div className="mb-4 d-flex justify-content-center">
                  <ReCAPTCHA
                    sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                    onChange={handleCaptchaChange}
                    theme="dark"
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="py-3 fw-bold"
                    disabled={isSending || loadingEmployees}
                  >
                    {isSending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      "Submit Project Details"
                    )}
                  </Button>
                </div>

                {/* Feedback Message */}
                {feedbackMessage && (
                  <Alert 
                    variant={
                      feedbackType === "success" ? "success" :
                      feedbackType === "warning" ? "warning" : "danger"
                    } 
                    className="mt-4 text-center"
                  >
                    {feedbackMessage}
                  </Alert>
                )}
              </Form>
            </div>

            {/* Debug Info (for development) */}
            <div className="mt-4 text-center text-muted small">
              <p>Page Path: {location.pathname}</p>
              <p>callSource: {getCallSource()}</p>
              <p>Employees Loaded: {employees.length}</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default LeadForm;