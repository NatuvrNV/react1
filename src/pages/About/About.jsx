import { AboutHeroSection } from "../../collection";
import { useEffect } from "react";
import { VisionAndMission } from "../../collection/about/VisionAndMission/VisionAndMission";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer";
import { AtAGlanceSection } from "../../collection/about/AtAGlanceSection/AtAGlanceSection";
import { ReverseHeroSection } from "../../collection/about/ReverseHeroSection/ReverseHeroSection";
// import { MeetTeam } from "../../collection/about/MeetTeam/MeetTeam";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div id="hero-section">
        <div  className="tw-py-5  tw-mt-20">
          <AboutHeroSection />
        </div>

        <div className="tw-py-5">
          <VisionAndMission />
        </div>

        <div className="container-fluid tw-mx-auto tw-px-4 tw-py-5">
          <div
            className="tw-relative tw-w-full tw-overflow-hidden"
            style={{
              paddingTop: "56.25%", // 16:9 Aspect Ratio
            }}
          >
            <iframe
              className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full"
              src="https://www.youtube.com/embed/RRwuG5FdeNc?rel=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="tw-py-5">
          <AtAGlanceSection />
        </div>

        <div className="tw-py-5">
          <ReverseHeroSection />
        </div>

        {/* <div className="tw-container tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-items-center tw-mb-12">
          <h1 className="font tw-tracking-wide tw-leading-[50px] tw-text-[64px] tw-text-center ">
            Meet The Team
          </h1>
          <MeetTeam />
          <button className="hover-button" aria-label="See all projects">
            <span>See All Projects</span>
          </button>
        </div> */}
      </div>
      <Footer />
    </>
  );
};
