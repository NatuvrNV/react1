import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";
import { useEffect, useState } from "react";

// ✅ Lazy load images & preload for better LCP
const banners = [
  "https://res.cloudinary.com/dptxcqnnw/image/upload/v1764651199/1_a20e7u.jpg",
  "https://res.cloudinary.com/dptxcqnnw/image/upload/v1764651200/3_gi5hw3.jpg",
  "https://res.cloudinary.com/dptxcqnnw/image/upload/v1764651199/2_hpo03h.jpg",
];

export const Swipper = () => {
  const [loadedImages, setLoadedImages] = useState([banners[0]]); // Preload first image

  useEffect(() => {
    banners.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => [...prev, src]);
      };
    });

    // ✅ Prevent text selection when clicking swiper buttons
    const preventSelection = (event) => {
      if (event.target.closest(".swiper-button-next, .swiper-button-prev")) {
        event.preventDefault();
      }
    };

    document.addEventListener("mousedown", preventSelection);

    return () => {
      document.removeEventListener("mousedown", preventSelection);
    };
  }, []);

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
            onMouseDown={(e) => e.preventDefault()} // ✅ Prevent selection inline
          >
            <MdArrowBack size={30} />
          </div>
          <div
            className="swiper-button-next"
            onMouseDown={(e) => e.preventDefault()} // ✅ Prevent selection inline
          >
            <MdArrowForward size={30} />
          </div>
        </div>

        {banners.map((src, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide banner-slide"
              style={{
                backgroundImage: `url(${loadedImages.includes(src) ? src : banners[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f5f5f5", // ✅ Placeholder color while loading
              }}
            >
              {<div className="slide-content">
                {index === 0 && <h1>India’s Leading Facade & Wall Cladding Experts</h1>}
                {index === 1 && <h1>Masters in Parametric Design & Execution</h1>}
                {index === 2 && <h1>Metal is Metaguise: The Future of Facades</h1>}
              </div> }
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
