import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { MdArrowBack, MdArrowForward } from "react-icons/md"; // Import your arrow icons
import "swiper/css/navigation";
import "./Swipper.css";

export const Swipper = () => {
  return (
<div className="banner-slide">
<Swiper 
      id="banner-slide"
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 8000,
        disableOnInteraction: false,
      }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      modules={[Navigation, Autoplay]}
      style={{ height: "80vh" }}
    >

                    {/* Navigation Arrows */}
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
          style={{ backgroundImage: `url('../assets/banner4.jpg')` }}
        >
          <div className="slide-content">
          <h1> India’s Leading Facade & Wall Cladding Experts</h1>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          className="slide"
          style={{ backgroundImage: `url('../assets/banner1.jpg')` }}
        >
          <div className="slide-content">
          <h1>Masters in Parametric Design & Execution</h1>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          className="slide"
          style={{ backgroundImage: `url('../assets/banner3.jpg')` }}
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