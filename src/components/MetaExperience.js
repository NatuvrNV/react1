import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import './MetaExperience.css'; // Assuming your CSS is in this file

import { useNavigate } from "react-router-dom";

import { useInView } from 'react-intersection-observer';



const MetaExperience = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getLineColor = (lineIndex) => {
    const lineHeight = 100; // Adjust this value based on your design
    const effectivePosition = (scrollPosition + window.innerHeight) % (lineHeight * 3);
    return effectivePosition >= lineIndex * lineHeight ? "white" : "grey";
  };

  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 0.1, // When 10% of the component is in view
  });


  return (
    <Container fluid className="metaexperience-section text-center " ref={ref}>
      <Row className="justify-content-center mt-4">
        <Col xs={12}>
          <h2 className="display-3 metavision-title">
          The Metaguise Experience

          </h2>

         
        </Col>
      </Row>
      <Row className="justify-content-center mt-lg-4">
        <Col xs={12} md={8} lg={8}>
          <div className="paragraph">
            <p style={{ color: getLineColor(1) }}> We are India’s Premier Facade cladding company </p>
            <p style={{ color: getLineColor(2) }}> and pioneers behind bringing landmark parametric </p>
            <p style={{ color: getLineColor(3) }}>elevations to life across the nation.</p>
            <p style={{ color: getLineColor(4) }}>We create bespoke designs with execute them with cutting edge technology </p>
            <p style={{ color: getLineColor(5) }}> and a high level of detailing. At Metaguise, we believe that your facade should reflect your identity! </p>
          </div>
        </Col>
      </Row>

   
      <button className="hover-button" aria-label="See all projects" onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/contact"); }}>
        <span>Get In Touch</span>
      </button> 
      
 
    </Container>
  );
};

export default MetaExperience;

