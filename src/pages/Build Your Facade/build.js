import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./build.css";
import PhoneInput from "react-phone-input-2";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    role: "",
    projectType: "", // Single selection - string instead of array
    timeline: "",
    otherProject: "",
    otherTimeline: "",
    squareFeet: "",
    has3DDrawings: "",
    projectBrief: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ""}));
    }
    
    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle phone input
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors(prev => ({...prev, phone: ""}));
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
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
        console.log(`Fetched ${data.object.content.length} employees`);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Function to parse range string
  const parseRange = (rangeString) => {
    if (!rangeString) return { min: 0, max: 0 };
    
    const parts = rangeString.split('-').map(part => parseInt(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    return { min: 0, max: 0 };
  };

  // Convert square feet selection to approximate number
  const getSqftNumber = (sqftSelection) => {
    if (!sqftSelection) return 5000;
    
    const sqftMap = {
      "Under 1000 sq ft": 500,
      "1000-3000 sq ft": 2000,
      "3001-10000 sq ft": 6500,
      "10001+ sq ft": 15000
    };
    
    return sqftMap[sqftSelection] || 5000;
  };

  // Find matching employees
  const findMatchingEmployees = (sqftSelection) => {
    const sqftNum = getSqftNumber(sqftSelection);
    console.log(`Looking for employees matching SQFT: ${sqftNum} (from selection: ${sqftSelection})`);
    
    const matchingEmployees = employees.filter(emp => {
      const range = parseRange(emp.employeeAssignmentRange);
      const isMatch = sqftNum >= range.min && sqftNum <= range.max;
      return isMatch;
    });

    console.log(`Found ${matchingEmployees.length} matching employees`);
    return matchingEmployees;
  };

  // Prepare lead assignments
  const prepareLeadAssignments = (matchedEmployees) => {
    return matchedEmployees.map(emp => ({
      role: "PRE_SALES",
      employeeId: emp.id,
      employeeName: emp.fullName || "Unknown Employee"
    }));
  };

  // Determine callSource - For build page
  const getCallSource = () => {
    return "BUILD";
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = "Valid phone number is required";
    if (!formData.role) newErrors.role = "Please select your role";
    if (!formData.projectType && !formData.otherProject) newErrors.projectType = "Please select a project type";
    if (!formData.squareFeet) newErrors.squareFeet = "Square feet area is required";
    if (!formData.timeline && !formData.otherTimeline) newErrors.timeline = "Timeline is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create lead in backend
  const createLeadInBackend = async () => {
    const callSource = getCallSource();
    const sqftSelection = formData.squareFeet;
    const sqftNum = getSqftNumber(sqftSelection);
    
    // Find matching employees
    const matchedEmployees = findMatchingEmployees(sqftSelection);
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Map form values to backend fields
    const projectType = formData.projectType + (formData.otherProject ? `, ${formData.otherProject}` : "");
    const timeline = formData.timeline + (formData.otherTimeline ? `, ${formData.otherTimeline}` : "");
    
    // Map 3D drawings to boolean
    const has3dOrSiteDrawings = formData.has3DDrawings === "Yes";

    // Map role to backend format
    const getCustomerType = () => {
      switch(formData.role) {
        case "Architect": return "ARCHITECT";
        case "Real Estate Developer": return "DEVELOPER";
        case "End User": return "END_USER";
        default: return "";
      }
    };

    // Map project type to backend format
    const getProjectType = () => {
      switch(formData.projectType) {
        case "Residential": return "RESIDENTIAL";
        case "Commercial": return "COMMERCIAL";
        case "Retail": return "RETAIL";
        case "Hospitality": return "HOSPITALITY";
        default: return "COMMERCIAL"; // Default
      }
    };

    // Prepare payload for backend API
    const payload = {
      firstName: formData.name.split(' ')[0] || formData.name,
      fullName: formData.name,
      contact: formData.phone,
      email: "",
      address: formData.city ? `${formData.city}, India` : "India",
      locality: formData.city || "",
      city: formData.city || "",
      district: formData.city || "",
      state: formData.city ? "INDIA" : "",
      pincode: "000000",
      pincodeMappingId: "693f98b3f956d25cedd37dfc",
      projectType: getProjectType(),
      customerType: getCustomerType(),
      engagementTimeline: formData.timeline === "Immediate" ? "IMMEDIATE" : formData.timeline === "Next Month" ? "NEXT_MONTH" : "FUTURE",
      has3dOrSiteDrawings: has3dOrSiteDrawings,
      approximateFacadeCladdingSqFt: sqftNum,
      projectBrief: formData.projectBrief || `Project type: ${projectType}. Timeline: ${timeline}. Role: ${formData.role}. Square feet: ${sqftSelection}.`,
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: formData.projectBrief || "",
      callRegistration: true,
      leadAssignments: leadAssignments,
      callSource: "BUILD"
    };

    console.log("Creating lead with payload:", payload);
    console.log("Selected project type:", formData.projectType);
    console.log("Mapped projectType:", getProjectType());
    console.log("Mapped customerType:", getCustomerType());

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

      return response.ok;
    } catch (err) {
      console.error("Error creating lead:", err);
      return false;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setMessage("❌ Please fill all required fields correctly.");
      return;
    }

    setIsSending(true);
    setMessage("");

    try {
      // Send to Make.com webhook (original functionality)
      const leadData = {
        name: formData.name,
        city: formData.city,
        phone: formData.phone,
        role: formData.role,
        projectType: formData.projectType + (formData.otherProject ? `, ${formData.otherProject}` : ""),
        otherProject: formData.otherProject,
        timeline: formData.timeline,
        otherTimeline: formData.otherTimeline,
        squareFeet: formData.squareFeet,
        has3DDrawings: formData.has3DDrawings,
        projectBrief: formData.projectBrief,
        date: new Date().toISOString(),
      };

      const webhookResponse = await fetch("https://hook.eu2.make.com/jppie74gnfp2fvct6zrl5d02c4p0rk23", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      // Send to backend API
      const backendResponse = await createLeadInBackend();

      if (webhookResponse.ok && backendResponse) {
        setMessage("✅ Lead sent successfully!");

        // Reset form fields
        setFormData({
          name: "",
          city: "",
          phone: "",
          role: "",
          projectType: "",
          timeline: "",
          otherProject: "",
          otherTimeline: "",
          squareFeet: "",
          has3DDrawings: "",
          projectBrief: "",
        });
        setErrors({});
      } else if (webhookResponse.ok) {
        setMessage("✅ Form submitted! (Backend sync may be delayed)");
      } else if (backendResponse) {
        setMessage("✅ Lead created in system! (Webhook may have failed)");
      } else {
        setMessage("❌ Failed to send data. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Metaguise</title>
      </Helmet>

      <Container fluid className="bg-dark text-white contact-container">
        <Row className="contact-row">
          <Col md={6} className="contact-left d-flex flex-column justify-content-center gap-4">
            <div className="contactus1-text">
              <p>Thank you for</p>
              <p>showing interest</p>
              <p>Contact Us</p>
            </div>
          </Col>

          <Col md={6} className="contact-right d-flex flex-column justify-content-center">
            <Form className="w-100" onSubmit={handleSubmit}>
              {/* Name - REQUIRED */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="bg-contact form-text border-0"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      disabled={isSending}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Phone - REQUIRED */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      inputClass={`bg-contact form-text border-0 w-100 ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter phone number"
                      disabled={isSending}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* City + Role */}
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      isInvalid={!!errors.city}
                      disabled={isSending}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Role - REQUIRED */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Are You *</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      isInvalid={!!errors.role}
                      disabled={isSending}
                      required
                    >
                      <option value="">Select your role *</option>
                      <option value="Architect">An Architect</option>
                      <option value="Real Estate Developer">A Real Estate Developer</option>
                      <option value="End User">An End User</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.role}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Square Feet - REQUIRED */}
              <Row className="mt-2">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Square Feet Area *</Form.Label>
                    <Form.Select
                      name="squareFeet"
                      value={formData.squareFeet}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                      isInvalid={!!errors.squareFeet}
                      disabled={isSending}
                      required
                    >
                      <option value="">Select area range *</option>
                      <option value="Under 1000 sq ft">Under 1,000 sq ft</option>
                      <option value="1000-3000 sq ft">1,000 - 3,000 sq ft</option>
                      <option value="3001-10000 sq ft">3,001 - 10,000 sq ft</option>
                      <option value="10001+ sq ft">10,001+ sq ft</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.squareFeet}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Project Type - REQUIRED - Now as radio buttons for single selection */}
              <Form.Group className="mt-3 form-project">
                <Form.Label>Type of Project *</Form.Label>
                <div className="d-md-flex flex-wrap gap-3 my-3 project-fields">
                  {["Residential", "Commercial", "Retail", "Hospitality"].map((type) => (
                    <Form.Check
                      key={type}
                      type="radio"
                      name="projectType"
                      id={`project-${type}`}
                      label={type}
                      value={type}
                      onChange={handleChange}
                      checked={formData.projectType === type}
                      disabled={isSending}
                      inline
                      className="me-4"
                    />
                  ))}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Other (if not listed above)"
                  name="otherProject"
                  className="bg-contact form-text border-0 mt-2"
                  value={formData.otherProject}
                  onChange={handleChange}
                  disabled={isSending}
                />
                {errors.projectType && !formData.otherProject && (
                  <div className="text-danger small mt-1">
                    {errors.projectType}
                  </div>
                )}
              </Form.Group>

              {/* Timeline - REQUIRED */}
              <Form.Group className="mt-3">
                <Form.Label>How soon would you like to engage Metaguise *</Form.Label>
                <Form.Select
                  name="timeline"
                  value={formData.timeline}
                  className="bg-contact form-text border-0"
                  onChange={handleChange}
                  isInvalid={!!errors.timeline && !formData.otherTimeline}
                  disabled={isSending}
                  required
                >
                  <option value="">Select timeline *</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Design stage">
                    Would like to engage on design though civil not ready yet
                  </option>
                </Form.Select>
                {errors.timeline && !formData.otherTimeline && (
                  <div className="invalid-feedback d-block">
                    {errors.timeline}
                  </div>
                )}
                <Form.Control
                  type="text"
                  placeholder="Other timeline (if not listed above)"
                  name="otherTimeline"
                  className="bg-contact form-text border-0 mt-2"
                  value={formData.otherTimeline}
                  onChange={handleChange}
                  disabled={isSending}
                />
              </Form.Group>

              {/* 3D Drawings */}
              <Form.Group className="mt-3">
                <Form.Label>3D / Site Drawings Available?</Form.Label>
                <div className="d-flex gap-4 my-3">
                  <Form.Check
                    type="radio"
                    name="has3DDrawings"
                    id="drawings-yes"
                    label="Yes"
                    value="Yes"
                    checked={formData.has3DDrawings === "Yes"}
                    onChange={handleChange}
                    disabled={isSending}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    name="has3DDrawings"
                    id="drawings-no"
                    label="No"
                    value="No"
                    checked={formData.has3DDrawings === "No"}
                    onChange={handleChange}
                    disabled={isSending}
                    inline
                  />
                </div>
              </Form.Group>

              {/* Project Brief */}
              <Form.Group className="mt-3">
                <Form.Label>Project Brief</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="projectBrief"
                  placeholder="Tell us more about your project..."
                  className="bg-contact form-text border-0"
                  value={formData.projectBrief}
                  onChange={handleChange}
                  disabled={isSending}
                />
              </Form.Group>

              {/* Submit */}
              <div className="mt-4 d-flex gap-2">
                <button type="submit" disabled={isSending} className="send-button">
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </div>

              {message && (
                <p className={`mt-3 ${message.includes("✅") ? "text-success" : "text-danger"}`}>
                  {message}
                </p>
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