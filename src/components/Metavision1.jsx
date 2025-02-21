import { Container, Row, Col } from "react-bootstrap";
import "./Metavision.css";
import Coinback from "../assets/coinback.png";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Metavision1 = () => {
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
    gsap.from("#meta-para", {
      opacity:0,
      duration: 2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%", // Starts when section top hits 80% viewport
        end: "bottom end", // Ends when section bottom hits 20% viewport
        scrub: true,
    
        toggleActions: "play reverse resume reverse"
      }
    });
  
    // Coin animation
    if (isDesktop) {
      gsap.from("#coin", {
        x: 3000,
        y: -250,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // Starts when the section enters the viewport
          end: "top center", // Ends when the section reaches the center
          scrub: 1, // Smooth scrubbing
         
        }
      });
    }
  }, [isDesktop]);

  return (
    <Container
      fluid
      className="metavision-section text-center "
      ref={containerRef}
    >
      <Row className="justify-content-center mt-4">
        <Col xs={12}>
          <div className="tw-flex tw-justify-center tw-items-center">
            <h1 className="display-3 metavision-title tw-text-[128px] tw-leading-[120px] tw-mb-5">
              Metavisi
            </h1>
            <img id="coin" src={Coinback} alt="Coinback" />
            <h1 className="display-3 metavision-title tw-text-[128px] tw-leading-[120px] tw-mb-5">
              n
            </h1>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center my-lg-4">
        <Col xs={12} md={8} lg={8}>
          <div id="meta-para" className="paragraph font tw-text-gray-500">
            <p className="font desktop">
              DRV (Shri Deepak Raheja’s Vision) is the bloodline of all meta{" "}
            </p>
            <p className="desktop">
              organizations,based on the life lessons taught by our founding
              father
            </p>
            <p className="desktop">
              specifically focusing on a mindset “Anything is Possible” when the
              will
            </p>
            <p className="desktop">
              is unbreakable, standards un-challengeable,energy in-exhaustible,
            </p>
            <p className="desktop">
              {" "}
              morals un-corruptable,and the aura unstoppable.
            </p>

            <p className="mobile text-center tw-text-gray-500">
              DRV (Shri Deepak Raheja’s Vision) is the bloodline of all meta
              organizations, based on the life lessons taught by our founding
              father specifically focusing on a mindset  “Anything is Possible”
              when the will is unbreakable, standards un-challengable, energy
              in-exhaustible, morals un-corruptable and the aura unstoppable.
            </p>
          </div>
        </Col>
      </Row>
     

     
      <button id="about-button" className="hover-button" aria-label="See all projects" onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/about"); }}>
        <span>About Us</span>
      </button>
     
    </Container>
  );
};

export default Metavision1;
