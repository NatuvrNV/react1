import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./build.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    role: "",
    projectType: [],
    timeline: "",
    otherProject: "",
    otherTimeline: "",
    squareFeet: "",
    hasDrawings: "",
    projectBrief: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

  // Square feet options for dropdown
  const squareFeetOptions = [
    { value: "", label: "Select Area Range" },
    { value: "0-1000", label: "under 1,000 sq ft" },
    { value: "1001-3000", label: "1,001 - 3,000 sq ft" },
    { value: "3001-10000", label: "3,001 - 10,000 sq ft" },
    { value: "10001+", label: "10,001+ sq ft" },
  ];

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) =>
        checked
          ? { ...prev, projectType: [...prev.projectType, value] }
          : { ...prev, projectType: prev.projectType.filter((item) => item !== value) }
      );
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle phone input
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // Handle CAPTCHA change
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
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

  const findMatchingEmployees = (sqftRange) => {
    if (!sqftRange) return [];
    
    let sqftNum;
    if (sqftRange === "20001+") {
      sqftNum = 20001; // Minimum for 20,001+
    } else {
      // Get the average of the range for matching
      const rangeParts = sqftRange.split('-');
      if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        sqftNum = (parseInt(rangeParts[0]) + parseInt(rangeParts[1])) / 2;
      } else {
        return [];
      }
    }

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
    // Find matching employees based on square feet range
    const matchedEmployees = findMatchingEmployees(formData.squareFeet);
    
    if (matchedEmployees.length === 0) {
      console.log("No matching employees found for SQFT range:", formData.squareFeet);
      return false;
    }

    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Calculate approximate square feet based on selection
    let approximateSqFt = 0;
    if (formData.squareFeet) {
      if (formData.squareFeet === "20001+") {
        approximateSqFt = 25000; // Default for 20,001+
      } else {
        const rangeParts = formData.squareFeet.split('-');
        if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
          approximateSqFt = (parseInt(rangeParts[0]) + parseInt(rangeParts[1])) / 2;
        }
      }
    }

    // Get state based on city (simplified logic - you can expand this)
    const getStateFromCity = (city) => {
      // This is simplified - you might want to implement a more robust city-state mapping
      if (city.toLowerCase().includes("delhi") || city.toLowerCase().includes("new delhi")) {
        return "DELHI";
      } else if (city.toLowerCase().includes("gurgaon") || city.toLowerCase().includes("gurugram")) {
        return "HARYANA";
      } else if (city.toLowerCase().includes("mumbai") || city.toLowerCase().includes("pune")) {
        return "MAHARASHTRA";
      } else if (city.toLowerCase().includes("bangalore") || city.toLowerCase().includes("bengaluru")) {
        return "KARNATAKA";
      } else if (city.toLowerCase().includes("chennai")) {
        return "TAMIL NADU";
      } else if (city.toLowerCase().includes("ahmedabad")) {
        return "GUJARAT";
      } else {
        return "HARYANA"; // Default
      }
    };

    // Get pincode mapping ID based on state (simplified)
    const getPincodeMappingId = (state) => {
      // Default pincode mapping IDs - you need to get actual IDs from your system
      const mapping = {
        "DELHI": "693f98b3f956d25cedd37dfc",
        "HARYANA": "693f98b3f956d25cedd37dfc",
        "MAHARASHTRA": "693f9944f956d25cedd45534",
        "GUJARAT": "693f9944f956d25cedd45534",
        "KARNATAKA": "693f9944f956d25cedd45534",
        "TAMIL NADU": "693f9944f956d25cedd45534",
      };
      return mapping[state] || "693f98b3f956d25cedd37dfc"; // Default to Haryana
    };

    const state = getStateFromCity(formData.city);
    const pincodeMappingId = getPincodeMappingId(state);

    // Prepare project brief from form data
    const projectBrief = `
      Role: ${formData.role}
      Project Types: ${formData.projectType.join(", ")} ${formData.otherProject ? `, Other: ${formData.otherProject}` : ''}
      Engagement Timeline: ${formData.timeline} ${formData.otherTimeline ? `, Other: ${formData.otherTimeline}` : ''}
      City: ${formData.city}
      Area Range: ${squareFeetOptions.find(opt => opt.value === formData.squareFeet)?.label || 'Not specified'}
      3D/Site Drawings Available: ${formData.hasDrawings === "yes" ? "Yes" : "No"}
      Additional Project Brief: ${formData.projectBrief || "Not provided"}
    `;

    // Map role to customer type
    const getCustomerType = (role) => {
      switch(role) {
        case "Architect": return "ARCHITECT";
        case "Real Estate Developer": return "DEVELOPER";
        case "End User": return "END_USER";
        default: return "END_USER";
      }
    };

    // Prepare final payload for API
    const payload = {
      firstName: formData.name.split(' ')[0] || formData.name,
      fullName: formData.name,
      contact: formData.phone,
      email: "contact@metaguise.com", // Default email
      address: formData.city,
      locality: formData.city,
      city: formData.city,
      district: formData.city,
      state: state,
      pincode: "110001", // Default pincode
      pincodeMappingId: pincodeMappingId,
      projectType: "RESIDENTIAL",
      customerType: getCustomerType(formData.role),
      engagementTimeline: formData.timeline.toUpperCase() || "IMMEDIATE",
      has3dOrSiteDrawings: formData.hasDrawings === "yes",
      approximateFacadeCladdingSqFt: approximateSqFt,
      projectBrief: projectBrief,
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `Build with Metaguise form submission. ${projectBrief}`,
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage("");
    setShowLeadSuccess(false);

    // Basic validation
    if (!formData.name.trim() || !formData.city.trim() || !formData.phone.trim() || !formData.squareFeet) {
      setMessage("❌ Name, City, Phone, and Area Range are required.");
      setIsSending(false);
      return;
    }

    if (!formData.role) {
      setMessage("❌ Please select your role.");
      setIsSending(false);
      return;
    }

    if (formData.projectType.length === 0 && !formData.otherProject) {
      setMessage("❌ Please select at least one project type.");
      setIsSending(false);
      return;
    }

    if (!formData.timeline && !formData.otherTimeline) {
      setMessage("❌ Please select engagement timeline.");
      setIsSending(false);
      return;
    }

    if (!formData.hasDrawings) {
      setMessage("❌ Please indicate if 3D/Site Drawings are available.");
      setIsSending(false);
      return;
    }

    if (!captchaValue) {
      setMessage("⚠️ Please complete the CAPTCHA verification.");
      setIsSending(false);
      return;
    }

    try {
      // Create lead in backend API
      const leadCreated = await createLead();
      
      // Show success message
      if (leadCreated && showLeadSuccess) {
        setMessage("✅ Thank you for your interest! Our team will connect with you shortly.");
      } else if (leadCreated) {
        setMessage("✅ Thank you for your interest! We will get in touch with you soon.");
      } else {
        setMessage("✅ Thank you for your submission!");
      }

      // Reset form fields
      setFormData({
        name: "",
        city: "",
        phone: "",
        role: "",
        projectType: [],
        timeline: "",
        otherProject: "",
        otherTimeline: "",
        squareFeet: "",
        hasDrawings: "",
        projectBrief: "",
      });
      
      setCaptchaValue(null);

    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Build with Metaguise | Metal Facade Cladding Experts</title>
        <meta
          name="description"
          content="Collaborate with Metaguise for premium metal facade cladding solutions. Share your project details and our team will connect with you."
        />
        <meta
          property="og:title"
          content="Build with Metaguise | Metal Facade Cladding Experts"
        />
        <meta
          property="og:description"
          content="Collaborate with Metaguise for premium metal facade cladding solutions. Share your project details and our team will connect with you."
        />
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest</p>
              <p>Building with Metaguise</p>
            </div>
          </Col>

          <Col md={6} className="contact-right d-flex flex-column justify-content-center">
            <Form className="w-100" onSubmit={handleSubmit}>
              {/* Name + Phone */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="bg-contact form-text border-0"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number </Form.Label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      inputClass="bg-contact form-text border-0 w-100"
                      placeholder="Enter phone number"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* City + Role */}
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Are You </Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Architect">An Architect</option>
                      <option value="Real Estate Developer">A Real Estate Developer</option>
                      <option value="End User">An End User</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Area Range (Square Feet) */}
              <Row className="mt-2">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Approximate Area Range </Form.Label>
                    <Form.Select
                      name="squareFeet"
                      value={formData.squareFeet}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      required
                    >
                      {squareFeetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Project Type */}
              <Form.Group className="mt-3 form-project">
                <Form.Label>Type of Project </Form.Label>
                <div className="d-md-flex my-3 project-fields">
                  {["Residential", "Commercial", "Retail", "Hospitality"].map((type) => (
                    <Form.Check
                      key={type}
                      type="checkbox"
                      label={type}
                      value={type}
                      onChange={handleChange}
                      checked={formData.projectType.includes(type)}
                    />
                  ))}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Other (Please specify)"
                  name="otherProject"
                  className="bg-contact form-text border-0"
                  value={formData.otherProject}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Timeline */}
              <Form.Group className="mt-3">
                <Form.Label>How soon would you like to engage Metaguise </Form.Label>
                <Form.Select
                  name="timeline"
                  value={formData.timeline}
                  className="bg-contact form-text border-0"
                  onChange={handleChange}
                  required={!formData.otherTimeline}
                >
                  <option value="">Select...</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Design stage">
                    Would like to engage on design though civil not ready yet
                  </option>
                </Form.Select>
                <Form.Control
                  type="text"
                  placeholder="Other timeline (Please specify)"
                  name="otherTimeline"
                  className="bg-contact form-text border-0 mt-2"
                  value={formData.otherTimeline}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* 3D / Site Drawings Available? Radio Button */}
              <Form.Group className="mt-3">
                <Form.Label>3D / Site Drawings Available? </Form.Label>
                <div className="d-flex gap-4 my-3">
                  <Form.Check
                    type="radio"
                    name="hasDrawings"
                    id="drawings-yes"
                    label="Yes"
                    value="yes"
                    checked={formData.hasDrawings === "yes"}
                    onChange={handleChange}
                    required
                  />
                  <Form.Check
                    type="radio"
                    name="hasDrawings"
                    id="drawings-no"
                    label="No"
                    value="no"
                    checked={formData.hasDrawings === "no"}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>

              {/* Project Brief Textarea */}
              <Form.Group className="mt-3">
                <Form.Label>Project Brief</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="projectBrief"
                  placeholder="Tell us more about your project..."
                  className="bg-contact form-text border-0"
                  value={formData.projectBrief}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* CAPTCHA */}
              <div className="mt-3 mb-3 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6Lf5GwksAAAAAILPCzd0RMkNRtjFLPyph-uV56Ev"
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>

              {/* Submit */}
              <div className="mt-4">
                <button type="submit" disabled={isSending} className="send-button w-100">
                  {isSending ? "Processing..." : "Submit Details"}
                </button>
              </div>

              {message && (
                <Alert 
                  variant={
                    message.includes("❌") || message.includes("⚠️") 
                      ? "danger" 
                      : "success"
                  } 
                  className="mt-3 text-center"
                >
                  {message}
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
