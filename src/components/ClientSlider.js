import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./ClientSlider.css";

const logos = [
  "assets/Client/AB-Jewellers.png",
  "assets/Client/Apollo.png",
  "assets/Client/ASRO Arcade.png",
  "assets/Client/BDR.png",
  "assets/Client/Billionaire Homes.png",
  "assets/Client/BMW.png",
  "assets/Client/CitySpace82.png",
  "assets/Client/DSR-Builders.png",
  "assets/Client/Environ-Homes.png",
  "assets/Client/Fortis.png",
  "assets/Client/GLS-University.png",
  "assets/Client/Golf-Island.png",
  "assets/Client/GRT.png",
  "assets/Client/Hafeez-Contractor.png",
  "assets/Client/Indian-Railways.png",
  "assets/Client/M3M.png",
  "assets/Client/Miraj-Group.png",
  "assets/Client/MorphGenesis.png",
  "assets/Client/Odisha-Cricket-Association.png",
  "assets/Client/Radisson.png",
  "assets/Client/Reliance.png",
  "assets/Client/Sachin-Tendulkar.png",
  "assets/Client/Studio-Ardete.png",
  "assets/Client/Studio-Lotus.png",
  "assets/Client/Studio-Mathema.png",
  "assets/Client/Tanishq_.png",
  "assets/Client/Vensa-Group.png",
  "assets/Client/Westin-Residences.png",
  
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