import React, { useState, useRef, useEffect } from "react";
import "./VisionAndMission.css";
import VisionIcon from "../../../assets/about/vision.png";
import MissionIcon from "../../../assets/about/mission.png";

export const VisionAndMission = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  const visions = [
    {
      id: 1,
      icon: VisionIcon,
      title: "Vision",
       alt: "Target icon symbolizing Metaguise’s design vision, focus, and aspirational goals.",   // ✅ Added descriptive alt
      description1: `Our vision is to lead the evolution of facade architecture through cutting edge design, engineering, and material innovation, setting new standards for how buildings are imagined and built.`,
      description2: `We envision a future where every building in India — from a luxury residence in Delhi to a commercial tower in Mumbai — has an exterior designed with the same precision as its interior. Where metal facade systems become the intelligent standard for architecture that is built to last, not just built to stand. At Metaguise, we are turning that vision into reality — through parametric design, advanced aluminium cladding, and end-to-end in-house execution.`,

    },
    {
      id: 2,
      icon: MissionIcon,
      title: "Mission",
       alt: "Compass icon representing Metaguise’s mission to guide architectural innovation. ",   // ✅ Added descriptive alt
      description1: `Our mission is to design and deliver metal facade systems that enhance the performance, identity, and longevity of buildings - protecting them from harsh climates, reducing long-term maintenance costs, and creating exteriors that are visually unique and structurally sound. `,
      description2: `We are committed to being the most trusted facade partner for architects, developers, and homeowners across India by always delivering facades that are thoughtfully designed, engineered for performance, and executed to the highest standards. From the first design conversation to final installation, Metaguise owns and delivers every step of the process..
 `,
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && sliderRef.current) {
      const handleScroll = () => {
        const { scrollLeft, offsetWidth } = sliderRef.current;
        const itemWidth = offsetWidth * (window.innerWidth <= 640 ? 0.7 : 0.5);
        const index = Math.round(scrollLeft / itemWidth);
        setActiveSlide(index);
      };

      sliderRef.current.addEventListener("scroll", handleScroll);
      return () => sliderRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  const handleDotClick = (index) => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.offsetWidth * (window.innerWidth <= 640 ? 0.7 : 0.5);
      sliderRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      });
    }
  };

  if (isMobile) {
    return (
      <div className="vision-mission-container">
        <div className="mobile-slider" ref={sliderRef}>
          {visions.map((vision) => (
            <div key={vision.id} className="mobile-slide">
              <VisionAndMissionCard
                title={vision.title}
                icon={vision.icon}
                description1={vision.description1}
                description2={vision.description2}
                alt={vision.alt}   // ✅ pass alt
              />
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {visions.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${activeSlide === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="vision-mission-container">
      <div className="vision-mission-grid">
        {visions.map((vision) => (
          <VisionAndMissionCard
            key={vision.id}
            title={vision.title}
            icon={vision.icon}
            description1={vision.description1}
            description2={vision.description2}
            alt={vision.alt}   // ✅ pass alt
          />
        ))}
      </div>
    </div>
  );
};

const VisionAndMissionCard = ({ title, icon, description1, description2, alt }) => {
  return (
    <div className="vision-mission-card">
      <img src={icon} alt={alt} className="card-icon" />
      <div className="card-content">
        <h3 className="title">{title}</h3>
        <div className="description">
          <p>{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
    </div>
  );
};
