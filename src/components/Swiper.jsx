import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "./Swipper.css";
import { useEffect, useState } from "react";

// ✅ Import local banner images (adjust paths based on your folder structure)
import banner1 from "../assets/banner/1.webp";
import banner2 from "../assets/banner/2.webp";
import banner3 from "../assets/banner/3.webp";

const banners = [banner1, banner2, banner3];

export const Swipper = () => {
  const [loadedImages, setLoadedImages] = useState([banners[0]]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    // Preload all banner images
    banners.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => {
          if (!prev.includes(src)) {
            return [...prev, src];
          }
          return prev;
        });
      };
      img.onerror = () => {
        console.error(`Failed to load banner ${index + 1}:`, src);
        setImageErrors(prev => ({ ...prev, [src]: true }));
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

  const getImageUrl = (src) => {
    if (imageErrors[src]) {
      return loadedImages[0] || banners[0];
    }
    return loadedImages.includes(src) ? src : banners[0];
  };

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
            <div
              className="slide banner-slide"
              style={{
                backgroundImage: `url(${getImageUrl(src)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <div className="slide-content">
                {index === 0 && <h2>India’s Leading Facade & Wall Cladding Experts</h2>}
                {index === 1 && <h2>Masters in Parametric Design & Execution</h2>}
                {index === 2 && <h2>Metal is Metaguise: The Future of Facades</h2>}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};