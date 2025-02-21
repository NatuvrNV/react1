import React, { useEffect, useState } from "react";
import "./Metaland.css";
import VR from '../assets/vr.png';
import Maze from '../assets/maze.png';
import Building from '../assets/building.png';

const Metaland = () => {
  const [scale, setScale] = useState(1);
  const [iframeScale, setIframeScale] = useState(1);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const scaleFactor = 0.005;
  const iframeScaleFactor = 0.008;
  const transitionDuration = "1s";

  useEffect(() => {
    const handleScroll = () => {
      const metaSection = document.getElementById("meta-sectiom");
      if (!metaSection) return;

      const rect = metaSection.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!inView) return;

      const scrollY = window.scrollY;
      const minScale = 0.6;
      const maxScale = 1;
      const minIframeScale = 1;
      const maxIframeScale = 1.2;
      const scrollDiff = scrollY - prevScrollY;
      let newScale = scale;
      let newIframeScale = iframeScale;
      if (scrollDiff > 0) {
        newScale = Math.min(maxScale, scale + scaleFactor);
        newIframeScale = Math.min(maxIframeScale, iframeScale + iframeScaleFactor);
      } else if (scrollDiff < 0) {
        newScale = Math.max(minScale, scale - scaleFactor);
        newIframeScale = Math.max(minIframeScale, iframeScale - iframeScaleFactor);
      }
      setScale(newScale);
      setIframeScale(newIframeScale);
      setPrevScrollY(scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY, scale, iframeScale]);

  return (
    <div className="metaland-container">
      <div className="content">
        <div id="meta-sectiom" className="row">
          {/* Left Column */}
          <div className="col-xl-4 col-12 pe-8">
            <div className="row ps-xl-3 ps-0">
              <h2 id="meta-head" className="display-3 metavision-title  tw-text-[128px] tw-leading-[120px] tw-mb-5">Metaland</h2>
              <p id="metaland-text" className="text-sm text-left text-gray-600 mt-2">
                Bridging The Present and The Future
                <br /><br />
                of
                Architectural Innovation
              </p>
            </div>
            <div className="row mt-xl-4 mb-4 mb-xl-0 ">
              <div className="col-4 d-flex align-items-center meta-box ">
                <img src={VR} alt="arrow" className="w-full meta-icon"></img>
                <p className="text-sm mt-2 img-text">Experiential Technology</p>
              </div>
              <div className="col-4 d-flex align-items-center meta-box ">
                <img src={Maze} alt="maze" className="w-full meta-icon"></img>
                <p className="text-sm mt-2 img-text">Interactivity & Experience</p>
              </div>
              <div className="col-4 d-flex align-items-center meta-box ">
                <img src={Building} alt="building" className="w-full meta-icon"></img>
                <p className="text-sm mt-2 img-text">Hands-on project Consultation</p>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="col-xl-8 col-12">
            <p id="metaland-text2" className="text-sm text-left text-gray-600">
          <p>
          MetaLand by Metaguise is DRV’s immersive experience center, redefining architecture through cutting-edge sensory technologies.
          </p>

          <p>
         
              
              Here, visitors engage in an interactive journey exploring architectural possibilities where innovation and imagination converge. From the experiential Product Maze to CGI, VR, and AR applications, MetaLand offers a glimpse into the future. It’s a space where today’s innovations meet tomorrow’s potential, with facade products at the forefront of design.
            
          </p>

          <p>
     
              MetaLand is not just a destination—it’s an immersion into architectural evolution.
          </p>
            </p>
          </div>
        </div>
        <div className="col-12 mt-xl-5 mt-4"
          style={{ transform: `scale(${scale})`, transition: `transform ${transitionDuration} ease` }}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}>
          <div className="video-container">
       
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/mwmFELxs14E?si=IAtqZx13mJ8kiMUo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <div className="button-container">
              <a href="https://www.google.com/maps/place/METALAND%E2%84%A2+BY+METAGUISE%C2%AE/@28.4631664,77.0973513,17z/data=!3m1!4b1!4m6!3m5!1s0x390d19455a6f62b1:0x60bdf56eb4db946d!8m2!3d28.4631664!4d77.0973513!16s%2Fg%2F11tk30q8yv?entry=ttu&g_ep=EgoyMDI1MDIxOC4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D">
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
