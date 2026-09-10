import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";

// ImageKit banner images
// NOTE: base URLs kept as-is; ?tr=... transform params are appended per
// size in the srcSet below so we're never shipping a raw, untransformed
// 1920x1080 file to every viewport.
const banners = [
  "https://ik.imagekit.io/ylx9qggcp/1.webp",
  "https://ik.imagekit.io/ylx9qggcp/2.webp",
  "https://ik.imagekit.io/ylx9qggcp/3.webp",
];

// Banner titles
const bannerTitles = [
  "India’s Leading Facade & Wall Cladding Experts",
  "Masters in Parametric Design & Execution",
  "Metal is Metaguise: The Future of Facades",
];

// Build an ImageKit transform URL for a given width.
// f-webp forces webp output, q-80 keeps quality high while cutting payload.
const buildSrc = (base, width) => `${base}?tr=w-${width},q-80,f-webp`;

export const Swipper = () => {
  // Tracks whether Swiper has actually finished mounting and measuring the
  // DOM. The poster overlay below stays visible until this flips true, so
  // the user only ever sees a correctly-sized static image until Swiper is
  // provably ready — regardless of when swiper/css or Swipper.css finish
  // loading over the network.
  const [isReady, setIsReady] = useState(false);

  const handleSwiperInit = useCallback(() => {
    // Wait two animation frames: one for Swiper's own layout pass to
    // finish, one to guarantee the browser has actually painted it before
    // we reveal it and fade the poster out.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
  }, []);

  return (
    <div className="banner-slide" style={{ position: "relative", height: "80vh" }}>
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
        {/* Navigation buttons */}
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

        {/* Banner slides */}
        {banners.map((src, index) => (
          <SwiperSlide key={src}>
            <div className="slide banner-slide">
              <img
                src={buildSrc(src, 1920)}
                srcSet={`
                  ${buildSrc(src, 640)} 640w,
                  ${buildSrc(src, 1024)} 1024w,
                  ${buildSrc(src, 1920)} 1920w
                `}
                sizes="100vw"
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

      {/* ---- Static poster overlay ----
          Covers the entire Swiper instance until isReady flips true. Every
          style here is inline (not a className), so this overlay's layout
          is guaranteed correct on the very first paint no matter what the
          network is doing to Swipper.css or swiper/css. This is what
          actually eliminates the flash permanently — it doesn't matter
          what happens underneath while it's covered. */}
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
          src={buildSrc(banners[0], 1920)}
          srcSet={`
            ${buildSrc(banners[0], 640)} 640w,
            ${buildSrc(banners[0], 1024)} 1024w,
            ${buildSrc(banners[0], 1920)} 1920w
          `}
          sizes="100vw"
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