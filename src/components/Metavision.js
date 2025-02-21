import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import './Metavision.css'; // Assuming your CSS is in this file
import Coinback from '../assets/coinback.png';
import { useNavigate } from "react-router-dom";

import { useInView } from 'react-intersection-observer';



const Metavision = () => {
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
    <Container fluid className="metavision-section text-center " ref={ref}>
      <Row className="justify-content-center mt-4">
        <Col xs={12}>
          <h1 className="display-3 metavision-title">
            Metavisi<img
              src={Coinback}
              alt="Coinback"
              className={`metavision-item ${inView ? 'animate' : ''}`}
            />n
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-lg-4">
        <Col xs={12} md={8} lg={8}>
          <div className="paragraph">
            <p style={{ color: getLineColor(1) }}>DRV (Shri Deepak Raheja’s Vision) is the bloodline of all meta </p>
            <p style={{ color: getLineColor(2) }}>organizations,based on the life lessons taught by our founding father</p>
            <p style={{ color: getLineColor(3) }}>specifically focusing on a mindset “Anything is Possible” when the will</p>
            <p style={{ color: getLineColor(4) }}>is unbreakable, standards un-challengeable,energy in-exhaustible,</p>
            <p style={{ color: getLineColor(5) }}> morals un-corruptable,and the aura unstoppable.</p>
          </div>
        </Col>
      </Row>

   
      <button className="hover-button" aria-label="See all projects" onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/about"); }}>
        <span>About Us</span>
      </button> 
      
 
    </Container>
  );
};

export default Metavision;

