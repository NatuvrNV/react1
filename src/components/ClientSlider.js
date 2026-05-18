import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./ClientSlider.css";

const logos = [
  "assets/Client/ODC.png",
  "assets/Client/ardete.png",
  "assets/Client/asroarcade.png",
  "assets/Client/cityspace.png",
  "assets/Client/epsilon.png",
  "assets/Client/mathema.png",
];

const ClientLogoSlider = () => {
  return (
    <section className="logo-slider">

      {/* Heading */}
      <h2 className="client-heading">Our Clients</h2>

      {/* Slider */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={5}
        spaceBetween={40}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 20 },
          480: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 30 },
          1024: { slidesPerView: 5, spaceBetween: 40 },
        }}
      >
        {logos.map((logo, index) => (
          <SwiperSlide key={index}>
            <div className="logo-item">
              <img src={logo} alt={`client-${index}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
};

export default ClientLogoSlider;