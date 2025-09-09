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
      description1: ` Inspired by Shri Deepak Raheja’s vision(DRV) and pioneering spirit, our vision is to embrace the limitless potential of design, innovation and technology. Guided by the belief that "Anything is Possible.", we uphold unwavering standards, boundless creativity, and incorruptible values.`,
      description2: `We strive to reshape the architectural landscape, creating a legacy where resilience meets artistry, and ambition transforms into timeless excellence.`,
    },
    {
      id: 2,
      icon: MissionIcon,
      title: "Mission",
       alt: "Compass icon representing Metaguise’s mission to guide architectural innovation. ",   // ✅ Added descriptive alt
      description1: `At Metaguise, our mission is to transform architecture with innovation, precision, and craftsmanship. We challenge conventions to create visionary façades that endure, inspire, and redefine urban landscapes.`,
      description2: `With a steadfast commitment to sustainability and customization, we empower architects, designers, and developers to turn bold ideas into iconic landmarks that stand the test of time.
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
          />
        ))}
      </div>
    </div>
  );
};

const VisionAndMissionCard = ({ title, icon, description1, description2 }) => {
  return (
    <div className="vision-mission-card">
      <img src={icon} alt={title} className="card-icon" />
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
