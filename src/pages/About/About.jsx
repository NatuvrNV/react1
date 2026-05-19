import { AboutHeroSection } from "../../collection";
import { useEffect } from "react";
import { VisionAndMission } from "../../collection/about/VisionAndMission/VisionAndMission";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
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
         <Helmet>
              <title>About Metaguise | India's Metal Facade Pioneers </title>
              <meta name="description" content="Metaguise is India's premier parametric metal facade company with 1800+ completed projects. Trusted by architects nationwide for innovative, durable cladding." />
              <meta name="keywords" content="home, react, SEO, web development" />
              <meta name="author" content="Your Name" />
              <meta property="og:title" content="About Metaguise | Pioneers in Metal Facade Design " />
              <meta property="og:description" content="India's first parametric facade company. 1800+ projects, PAN India presence, and a growing global footprint. Know the team behind the facades." />
              <meta property="og:image" content="https://metaguise.com/home-image.jpg" />
              <meta property="og:url" content="https://metaguise.com/about" />
              <meta name="robots" content="index, follow" />
              <link rel="canonical" href="https://metaguise.com/about" />
            </Helmet>
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
  src="https://www.youtube.com/embed/t1SRYiLeQGg"
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
