import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";

export const Swipper = () => {
  return (
    <div className="banner-slide">
      {/* ✅ Navigation Buttons (Moved Outside of Swiper) */}


      <Swiper
        id="banner-slide"
        spaceBetween={0}
        slidesPerView={1}
        loop={true} // ✅ Ensures looping
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next", // ✅ Proper navigation selectors
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation, Autoplay]}
        style={{ height: "80vh" }}
      >
        {/* ✅ Fixed Background Image Loading */}

        <div className="swiper-navigation">
        <div className="swiper-button-prev">
          <MdArrowBack size={30} />
        </div>
        <div className="swiper-button-next">
          <MdArrowForward size={30} />
        </div>
      </div>
        <SwiperSlide>
          <div
            className="slide banner-slide"
            style={{ backgroundImage: `url(${require("../assets/banner4.jpg")})` }}
          >
            <div className="slide-content">
              <h1>India’s Leading Facade & Wall Cladding Experts</h1>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="slide"
            style={{ backgroundImage: `url(${require("../assets/banner1.jpg")})` }}
          >
            <div className="slide-content">
              <h1>Masters in Parametric Design & Execution</h1>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="slide"
            style={{ backgroundImage: `url(${require("../assets/banner3.jpg")})` }}
          >
            <div className="slide-content">
              <h1>Tailored facades that reflect your identity</h1>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
