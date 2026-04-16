import { useRef } from "react";
import "./Marquee.css";

const logos = [
  { id: 1, src: "https://ik.imagekit.io/ylx9qggcp/epsilon.png", alt: "Epsilon" },
  { id: 2, src: "https://ik.imagekit.io/ylx9qggcp/ODC.png", alt: "ODC" },
  { id: 3, src: "https://ik.imagekit.io/ylx9qggcp/mathema.png", alt: "Mathema" },
  { id: 4, src: "https://ik.imagekit.io/ylx9qggcp/asroarcade.png", alt: "Astro Arcade" },
  { id: 5, src: "https://ik.imagekit.io/ylx9qggcp/ardete.png", alt: "Ardete" },
  { id: 6, src: "https://ik.imagekit.io/ylx9qggcp/cityspace.png", alt: "Cityspace" },
];

const duplicatedLogos = [...logos, ...logos];

const Marquee = () => {
  const marqueeRef = useRef(null);

  const handleMouseEnter = () => {
    marqueeRef.current.style.animationPlayState = "paused";
  };

  const handleMouseLeave = () => {
    marqueeRef.current.style.animationPlayState = "running";
  };

  return (
    <section className="clients-section">
      
      {/* Heading ABOVE slider */}
   <div className="client-heading">
       <div className="client-text">Our Clients</div>
      <div className="client-text-mob">Our Clients</div>
   </div>

      <div className="marquee-wrapper">
        <div
          className="marquee-track"
          ref={marqueeRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {duplicatedLogos.map((logo, index) => (
            <div className="marquee-item" key={index}>
              <img src={logo.src} alt={logo.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Marquee;