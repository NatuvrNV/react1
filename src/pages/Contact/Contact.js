import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Footer from "../../components/Footer";
import "./Contact.css";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Square feet options for dropdown
  const squareFeetOptions = [
    { value: "", label: "Select Area Range" },
    { value: "0-1000", label: "Under 1,000 Sq ft" },
    { value: "1000-3000", label: "1,000-3,000 Sq ft" },
    { value: "3000-10000", label: "3,000-10,000 Sq ft" },
    { value: "10000+", label: "Over 10,000 Sq ft" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    squareFeet: "",
    message: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

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
        console.log("Employees fetched:", data.object.content.length);
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

  const calculateApproximateSqFt = (sqftRange) => {
    if (!sqftRange) return 5000; // Default value if no selection
    
    if (sqftRange === "10000+") {
      return 15000;
    } else {
      const rangeParts = sqftRange.split('-');
      if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        return (parseInt(rangeParts[0]) + parseInt(rangeParts[1])) / 2;
      }
    }
    return 5000; // Default value
  };

  const findMatchingEmployees = (sqftRange) => {
    const sqftNum = calculateApproximateSqFt(sqftRange);
    
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
    console.log("Creating lead...");
    
    // Find matching employees based on square feet range
    const matchedEmployees = findMatchingEmployees(formData.squareFeet);
    
    console.log("Matched employees:", matchedEmployees);
    
    if (matchedEmployees.length === 0) {
      console.log("No matching employees found. Using default assignment.");
      return false;
    }

    // Prepare lead assignments
    const leadAssignments = prepareLeadAssignments(matchedEmployees);

    // Get selected label for display
    const selectedLabel = squareFeetOptions.find(opt => opt.value === formData.squareFeet)?.label || 'Not specified';

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
      approximateFacadeCladdingSqFt: calculateApproximateSqFt(formData.squareFeet),
      projectBrief: formData.message || "Contact form submission",
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks: `Contact form inquiry. Area: ${selectedLabel}. ${formData.message}`,
      callRegistration: true,
      leadAssignments: leadAssignments
    };

    console.log("Creating lead with payload:", payload);

    try {
      const response = await fetch('https://backend.cshare.in/api/customer/create', {
        method: 'POST',
        headers: {
          'companyId': '693f9759f956d25cedd37a6f',
          'apiKey': '918ef419818745ef1f09f705a9642545', // Fixed: changed from 'apikey' to 'apiKey'
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log("Response status:", response.status);
      
      const responseText = await response.text();
      console.log("Lead creation response:", responseText);

      if (response.ok) {
        try {
          const responseData = JSON.parse(responseText);
          console.log("Lead created successfully:", responseData);
          setShowLeadSuccess(true);
          return true;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          console.log("Raw response:", responseText);
          setShowLeadSuccess(true);
          return true;
        }
      } else {
        console.error("Failed to create lead. Status:", response.status);
        console.error("Response text:", responseText);
        return false;
      }
    } catch (err) {
      console.error("Network error creating lead:", err);
      return false;
    }
  };

  const sendEmail = async () => {
    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      square_feet: formData.squareFeet ? squareFeetOptions.find(opt => opt.value === formData.squareFeet)?.label : "Not specified",
      message: formData.message || "Contact inquiry",
    };

    try {
      await emailjs.send(
        "service_hbh6e6a",
        "template_sp4d06m",
        emailParams,
        "aEASMHR8n6Vmgtj3l"
      );
      console.log("Email sent successfully via EmailJS");
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

    console.log("Form submission started");

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
      // Step 1: Send email via EmailJS
      console.log("Sending email via EmailJS...");
      const emailSent = await sendEmail();
      
      // Step 2: Create lead in backend
      console.log("Creating lead in backend...");
      const leadCreated = await createLead();
      
      // Show appropriate success message
      if (leadCreated && showLeadSuccess) {
        setFeedbackMessage("✅ Thank you for your inquiry! Our team will connect with you shortly.");
      } else if (emailSent && leadCreated) {
        setFeedbackMessage("✅ Thank you for your inquiry! Your message has been sent.");
      } else if (emailSent) {
        setFeedbackMessage("✅ Thank you for your inquiry! We will get in touch with you soon.");
      } else {
        setFeedbackMessage("✅ Thank you for your inquiry!");
      }

      // ✅ Google Ads Conversion Tracking Trigger
      if (typeof window !== "undefined" && window.gtag) {
        console.log("Triggering Google Ads conversion tracking");
        window.gtag("event", "conversion", {
          send_to: "AW-16992180594/XQxMCJvBnLkaEPKywKY_",
        });
      }

      // Reset form
      console.log("Resetting form...");
      setFormData({
        name: "",
        email: "",
        phone: "",
        squareFeet: "",
        message: "",
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
                      as="select"
                      name="squareFeet"
                      value={formData.squareFeet}
                      className="bg-contact form-text border-0"
                      onChange={handleChange}
                    >
                      {squareFeetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
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
                <button type="submit" className="send-button" disabled={isSending}>
                  <span>{isSending ? "Sending..." : "Send"}</span>
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

export default Contact;
