import React, { useEffect, useState, useRef } from "react";
import "https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.1/src/lite-yt-embed.js";
import "lite-youtube-embed/src/lite-yt-embed.css"; // styles for thumbnail + play button
import "./Metaland.css";
import VR from '../assets/vr.webp';
import Maze from '../assets/maze.webp';
import Building from '../assets/building.webp';

const Metaland = () => {
  const [scale, setScale] = useState(1);
  const prevScrollY = useRef(0);
  const metaSectionRef = useRef(null);
  const requestRef = useRef(null);
  
  const scaleFactor = 0.005;
  const transitionDuration = "1s";

  useEffect(() => {
    const handleScroll = () => {
      if (!metaSectionRef.current) return;

      const rect = metaSectionRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const scrollY = window.scrollY;
      const minScale = 0.6;
      const maxScale = 1;
      const scrollDiff = scrollY - prevScrollY.current;

      requestRef.current = requestAnimationFrame(() => {
        setScale((prevScale) =>
          scrollDiff > 0 ? Math.min(maxScale, prevScale + scaleFactor) : Math.max(minScale, prevScale - scaleFactor)
        );
      });

      prevScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="metaland-container">
      <div className="content">
        <div id="meta-section" ref={metaSectionRef} className="row">
          {/* Left Column */}
          <div className="col-xl-4 col-12 pe-8">
            <div className="row ps-xl-3 ps-0">
              <h2 id="meta-head" className="display-3 metavision-title tw-text-[128px] tw-leading-[120px] tw-mb-5">
                Metaland
              </h2>
              <p id="metaland-text" className="text-sm text-left text-gray-600 mt-2">
                Bridging The Present and The Future
                <br /><br />
                of Architectural Innovation
              </p>
            </div>

            {/* Feature Icons */}
            <div className="row mt-xl-4 mb-4 mb-xl-0">
              {[
                { 
                  img: VR, 
                  text: "Experiential Technology", 
                  alt: "VR headset icon representing Metaguise’s use of experiential design technologies." 
                },
                { 
                  img: Maze, 
                  text: "Interactivity & Experience", 
                  alt: "Maze-like icon symbolizing immersive design interactivity and client engagement." 
                },
                { 
                  img: Building, 
                  text: "Hands-on Project Consultation", 
                  alt: "Technical drawing icon representing personalized, on-site project consultation." 
                }
              ].map(({ img, text, alt }, index) => (
                <div key={index} className="col-4 d-flex align-items-center meta-box">
                  <img src={img} alt={alt} className="w-full meta-icon" loading="lazy" />
                  <p className="text-sm mt-2 img-text">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-xl-8 col-12">
            <div id="metaland-text2" className="text-sm text-left text-gray-600">
              <p>MetaLand by Metaguise is DRV’s immersive experience center, redefining architecture through cutting-edge sensory technologies.</p>
              <p>Here, visitors engage in an interactive journey exploring architectural possibilities where innovation and imagination converge. From the experiential Product Maze to CGI, VR, and AR applications, MetaLand offers a glimpse into the future. It’s a space where today’s innovations meet tomorrow’s potential, with facade products at the forefront of design.</p>
              <p>MetaLand is not just a destination—it’s an immersion into architectural evolution.</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
    {/* Video Section (Auto-load YouTube Embed) */}
      <div 
  className="col-12 mt-xl-5 mt-4" 
  style={{ transform: `scale(${scale})`, transition: `transform ${transitionDuration} ease` }}
>
  <div className="video-container">
    <lite-youtube 
      videoid="mwmFELxs14E"
      style={{ width: "100%", height: "500px" }}
      params="modestbranding=1&rel=0"
      title="Metaland immersive architecture experience video"
    ></lite-youtube>

    <div className="button-container">
      <a 
        href="https://maps.app.goo.gl/Nntum7Fj4LQmpPXa7" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <button id="project-button" className="hover-button">
          <span>Visit Now</span>
        </button>
      </a>
    </div>
  </div>
</div>


      </div>
    </div>
  );
};

export default Metaland;
