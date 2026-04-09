import AboutReverseHero from "../../../assets/about/about-reverse-hero.png";
import "./ReverseHeroSection.css";

import { useNavigate } from "react-router-dom";

export const ReverseHeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="tw-w-full tw-h-full">
      <div id="About-section" className="tw-flex tw-flex-col md:tw-flex-row  tw-mx-auto">
        <div className="tw-w-full md:tw-w-[40%] tw-pl-0">
          <img
            src={AboutReverseHero}
            alt="Metaguise installation team assembling facade panel on scaffolding with safety harnesses and yellow helmets."
            className="tw-w-full tw-h-full tw-object-cover"
          />
        </div>

        <div className="tw-w-full md:tw-w-[60%] tw-px-4 md:tw-px-40 tw-flex tw-flex-col tw-justify-start tw-text-left">
          <div className="tw-max-w-[600px] tw-space-y-6">
            <h1 className="tw-text-4xl Design-tittle tw-mt-4 md:tw-text-5xl lg:tw-text-[64px]  md:tw-leading-[60px] tw-font-bold tw-text-left">
              Design and Engineering Prowess
            </h1>

            <div id="Design" className="tw-space-y-6">
              <p className="tw-text-base tw-leading-relaxed tw-text-left">
               At Metaguise, design and engineering are not separate—they are one integrated process.
              </p>

              <p className="tw-text-base tw-leading-relaxed tw-text-left">
                Every facade is developed through a combination of design thinking and engineering expertise, ensuring that what is envisioned can be built efficiently and perform reliably. From straightforward cladding systems to complex parametric facades, each solution is tailored to respond to real-world conditions such as wind loads, thermal expansion, and building orientation - and is executed on-site by our teams with precision and consistency.
              </p>

              <p className="tw-text-base tw-leading-relaxed tw-text-left">
               We work with high-grade materials including aluminium, corten steel, stainless steel, zinc and copper - finished with European grade advanced coatings such as PVDF, anodization, and powder coating for long-term resistance to UV exposure and harsh Indian climates.
              </p>

                 <p className="tw-text-base tw-leading-relaxed tw-text-left">
                  At our Metalab facility, new systems are developed, tested and quality-checked before installation, ensuring consistency, durability, and performance.
              </p>

                 <p className="tw-text-base tw-leading-relaxed tw-text-left">
                  The result is simple: facades that look exactly as designed, perform reliably over time, and require minimal maintenance - and no two facades look the same. Because at Metaguise, your facade is your identity!
              </p>
            </div>

            <div className="tw-flex tw-justify-start hero-button ">
             

             
              <button id="see-button"
                className="hover-button  tw-mt-8"
                style={{
                  width:"auto"
                }}
                aria-label="See all projects"
                onClick={() => {
                  window.scrollTo(0, 0); // Scroll to top
                  navigate("/all-projects"); }}
              >
                <span>See Our Projects</span>
              </button>
   
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
