import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
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

export const Swipper = () => {
  const [isReady, setIsReady] = useState(false);

  const handleSwiperInit = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
  }, []);

  return (
    <div className="banner-slide" style={{ position: "relative" }}>
      <Swiper
        id="banner-slide"
        className="banner-swiper"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={800}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation, Autoplay]}
        onSwiper={handleSwiperInit}
      >
        <div className="swiper-navigation">
          <button
            type="button"
            className="swiper-button-prev"
            aria-label="Previous slide"
            onMouseDown={(e) => e.preventDefault()}
          >
            <MdArrowBack size={30} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="swiper-button-next"
            aria-label="Next slide"
            onMouseDown={(e) => e.preventDefault()}
          >
            <MdArrowForward size={30} aria-hidden="true" />
          </button>
        </div>

        {banners.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="slide banner-slide">
              <img
                src={src}
                alt={bannerTitles[index]}
                className="banner-slide-img"
                width="1920"
                height="1080"
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding={index === 0 ? "sync" : "async"}
              />

              <div className="slide-content">
                <h2>{bannerTitles[index]}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Static poster overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          overflow: "hidden",
          opacity: isReady ? 0 : 1,
          pointerEvents: isReady ? "none" : "auto",
          transition: "opacity 0.4s ease-out",
        }}
      >
        <img
          src={banners[0]}
          alt=""
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="sync"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "clamp(20px, 6vw, 80px)",
            paddingBottom: "clamp(30px, 8vw, 100px)",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px, 5vw, 64px)",
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: "2px",
              fontWeight: 500,
            }}
          >
            {bannerTitles[0]}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Swipper;