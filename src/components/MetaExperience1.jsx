import { Container, Row, Col } from "react-bootstrap";
import "./Metavision.css";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MetaExperience1 = () => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    gsap.to(".paragraph p", {
      color: "white",
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: "body",
        start: "top center",
        end: "center center",
        scrub: true,
        toggleActions: "play reverse",
        
      },
    });


  }, [isDesktop]);

  return (
    <Container
      fluid
      className="metaexperience-section text-center "
      ref={containerRef}
    >
      <Row className="justify-content-center mt-5">
        <Col xs={12}>
          <div className="tw-flex tw-justify-center tw-items-center">
            <h2 className="display-3 metavision-title tw-text-[128px] tw-leading-[120px] tw-mb-5">
            The Metaguise Experience

            </h2>

        
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center my-lg-4">
        <Col xs={12} md={8} lg={8}>
          <div className="paragraph font tw-text-gray-500">
            <p className="font desktop">
              We are India’s Premier Facade cladding company and pioneers{" "}
            </p>
            <p className="desktop">
            behind bringing landmark parametric elevations to life across the nation.
            </p>
            <p className="desktop">
            We create bespoke designs with execute them with cutting
            </p>
            <p className="desktop">
            edge technology and a high level of detailing. At Metaguise,
            </p>
            <p className="desktop">
              {" "}
              we believe that your facade should reflect your identity! 
            </p>

            <p className="mobile text-center tw-text-gray-500">
              We are India’s Premier Facade cladding company and pioneers
              behind bringing landmark parametric elevations to life across the nation.
              We create bespoke designs with execute them with cutting
              edge technology and a high level of detailing. At Metaguise,
              we believe that your facade should reflect your identity! 
            </p>
          </div>
        </Col>
      </Row>
     

     
      <button id="about-button" className="hover-button" aria-label="See all projects" onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/contact"); }}>
        <span>Get In Touch</span>
      </button>
     
    </Container>
  );
};

export default MetaExperience1;
