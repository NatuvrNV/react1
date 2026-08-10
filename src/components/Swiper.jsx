import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";

// ✅ Import local banner images (adjust paths based on your folder structure)
import banner1 from "../assets/banner/1.webp";
import banner2 from "../assets/banner/2.webp";
import banner3 from "../assets/banner/3.webp";

const banners = [banner1, banner2, banner3];

const bannerTitles = [
  "India\u2019s Leading Facade & Wall Cladding Experts",
  "Masters in Parametric Design & Execution",
  "Metal is Metaguise: The Future of Facades",
];

export const Swipper = () => {
  return (
    <div className="banner-slide">
      <Swiper
        id="banner-slide"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation, Autoplay]}
        style={{ height: "80vh" }}
      >
        <div className="swiper-navigation">
          <div
            className="swiper-button-prev"
            onMouseDown={(e) => e.preventDefault()}
          >
            <MdArrowBack size={30} />
          </div>
          <div
            className="swiper-button-next"
            onMouseDown={(e) => e.preventDefault()}
          >
            <MdArrowForward size={30} />
          </div>
        </div>

        {banners.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="slide banner-slide">
              {/*
                Real <img> instead of a CSS background-image:
                - lets the browser's preload scanner discover it directly
                  in the (prerendered) HTML, before any JS runs
                - lets us hint fetchpriority="high" on the first slide,
                  which isn't possible with a background-image
                - is detected far more reliably as the LCP element
              */}
              <img
                src={src}
                alt={bannerTitles[index]}
                className="banner-slide-img"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
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