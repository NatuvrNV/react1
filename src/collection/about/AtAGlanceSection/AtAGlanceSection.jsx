import React, { useState, useRef, useEffect } from "react";
import AboutIcon from "../../../assets/about/about-icon.svg";
import AboutIcon2 from "../../../assets/about/about-icon2.svg";
import AboutIcon3 from "../../../assets/about/about-icon3.svg";
import AboutIcon4 from "../../../assets/about/about-icon4.svg";
import AboutIcon5 from "../../../assets/about/about-icon5.svg";
import AboutIcon6 from "../../../assets/about/about-icon6.svg";
import AboutIcon7 from "../../../assets/about/about-icon7.svg";
import { GlanceBox } from "./GlanceBox";
import "./AtAGlanceSection.css";

export const AtAGlanceSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const glanceData = [
    {
      id: 1,
      heading: "Metaguise At A Glance",
    },
    {
      id: 2,
      heading: "India’s Premier Metal Facade and Cladding Company",
      icon: AboutIcon,
    },
    {
      id: 3,
      heading: "Over 1700 projects completed globally",
      icon: AboutIcon2,
    },
    {
      id: 4,
      heading: "Flagship Experience Center",
      icon: AboutIcon3,
    },
    {
      id: 5,
      heading: "Leveraging innovative technologies like CGI, VR and AR",
      icon: AboutIcon4,
    },
    {
      id: 6,
      heading: "Wide range of metal materials and patterns",
      icon: AboutIcon5,
    },
    {
      id: 7,
      heading: "Revolutionary parametric engineering algorithms",
      icon: AboutIcon6,
    },
    {
      id: 8,
      heading: "All weather tested products with warranty",
      icon: AboutIcon7,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    if (sliderRef.current && isMobile) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const itemWidth = sliderRef.current.offsetWidth * 0.7; // 70% of viewport for 1.5 items
      const newActiveSlide = Math.round(scrollPosition / itemWidth);
      setActiveSlide(newActiveSlide);
    }
  };

  const scrollToSlide = (index) => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.offsetWidth * 0.7;
      sliderRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="glance-cont" className="tw-container tw-mx-auto tw-px-4 tw-py-4">
    <h1 id="glance-title" className="products-title">Metaguise At A Glance</h1>
    <div
      className={`${
        isMobile
          ? "tw-flex  tw-overflow-x-auto tw-snap-x tw-snap-mandatory tw-scroll-smooth tw-hide-scrollbar"
          : "tw-grid  tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6 tw-justify-items-center"
      }`}
      ref={sliderRef}
      onScroll={handleScroll}
    >
      {glanceData.map((item, index) => (
        <div
          key={item.id}
          className={`${
            isMobile
              ? "tw-flex-shrink-0 tw-w-[70vw] tw-snap-center tw-mr-4 last:tw-mr-0"
              : ""
          } ${index === 0 ? "tw-hidden sm:tw-block" : ""}`} // Hide on mobile, show on desktop
        >
          <GlanceBox
            heading={item.heading}
            icon={item.icon}
            isMainHeading={item.id === 1}
          />
        </div>
      ))}
    </div>
    {isMobile && (
      <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-4 pagination-dots">
        {glanceData.map((_, index) => (
          <button
            key={index}
            className={`tw-w-2 tw-h-2 tw-rounded-full ${
              activeSlide === index
                ? "tw-bg-white"
                : "tw-bg-[rgba(255,255,255,0.3)]"
            }`}
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )}
  </div>
  
  );
};
