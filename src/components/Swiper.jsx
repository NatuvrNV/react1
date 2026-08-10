
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";

// ImageKit banner images
const banners = [
  "https://ik.imagekit.io/ylx9qggcp/1.webp?updatedAt=1771309963215",
  "https://ik.imagekit.io/ylx9qggcp/2.webp?updatedAt=1771309963055",
  "https://ik.imagekit.io/ylx9qggcp/3.webp?updatedAt=1771309963077",
];

// Banner titles
const bannerTitles = [
  "India’s Leading Facade & Wall Cladding Experts",
  "Masters in Parametric Design & Execution",
  "Metal is Metaguise: The Future of Facades",
];

export const Swipper = () => {
  return (
    <div className="banner-slide">
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
        style={{ height: "80vh" }}
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
                src={src}
                alt={bannerTitles[index]}
                className="banner-slide-img"
                width="1920"
                height="1080"
                loading={index === 0 ? "eager" : "lazy"}
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
    </div>
  );
};

export default Swipper;
