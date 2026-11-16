import { useState, useCallback } from "react";
import Carousel from "react-bootstrap/Carousel";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import OptimizedImage from "./OptimizedImage"; // <-- adjust path to where OptimizedImage.jsx lives
import "./Swipper.css";

// Local banner images (one file per banner)
import banner1 from "../assets/banner/1.webp";
import banner2 from "../assets/banner/2.webp";
import banner3 from "../assets/banner/3.webp";

const banners = [banner1, banner2, banner3];

const bannerTitles = [
  "India’s Leading Facade & Wall Cladding Experts",
  "Masters in Parametric Design & Execution",
  "Metal is Metaguise: The Future of Facades",
];

// Time each slide stays on screen (ms). Change this one value to speed up / slow down.
const AUTOPLAY_MS = 5000;

// Same export names as before, so pages/Home/Home.js needs no change.
export const Swipper = () => {
  const [index, setIndex] = useState(0);
  const total = banners.length;

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  return (
    <div className="banner-slide" style={{ position: "relative" }}>
      <Carousel
        id="banner-slide"
        className="banner-carousel"
        activeIndex={index}
        onSelect={setIndex}
        interval={AUTOPLAY_MS}
        ride="carousel"
        pause={false}
        controls={false}   // we render our own arrows below (only ONE arrow set)
        indicators={false}
        touch
        keyboard
      >
        {banners.map((src, i) => (
          <Carousel.Item key={i}>
            <div className="slide">
              <OptimizedImage
                src={src}
                alt={bannerTitles[i]}
                className="banner-slide-img"
                width={1920}
                height={1080}
                sizes="100vw"
                priority={i === 0}
                loading="eager"   /* only 3 images: load all so slides 2-3 never flash grey/low-res */
              />
              <div className="slide-content">
                <h2>{bannerTitles[i]}</h2>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Own class names (hero-nav-*) so Swiper library CSS can never add a 2nd arrow */}
      <div className="hero-nav">
        <button
          type="button"
          className="hero-nav-btn hero-nav-prev"
          aria-label="Previous slide"
          onClick={goPrev}
        >
          <MdArrowBack size={30} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hero-nav-btn hero-nav-next"
          aria-label="Next slide"
          onClick={goNext}
        >
          <MdArrowForward size={30} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Swipper;