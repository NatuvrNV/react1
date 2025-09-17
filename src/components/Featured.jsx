import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Features.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import Featured1 from "../assets/Featured/tanishq.jpg";
import Featured2 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f7_y1ifpm.webp";
import Featured3 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f3_uyfv39.webp";
import Featured4 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f8_unuj4n.webp";
import Featured5 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f6_kb4dxy.webp";
import Featured6 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f2_kym96e.webp";
import Featured7 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f4_cebj45.webp";
import Featured8 from "https://res.cloudinary.com/dptxcqnnw/image/upload/v1758096684/f1_cxmeie.webp";

const Features = () => {
  const navigate = useNavigate();
  const featuredImages = [
    { image: Featured1, name: "tanishq" },
    { image: Featured2, name: "caskey" },
    { image: Featured3, name: "vivek" },
    { image: Featured4, name: "rjjewellers" },
    { image: Featured5, name: "luxe" },
    { image: Featured6, name: "3939a" },
    { image: Featured7, name: "zenith" },
    { image: Featured8, name: "whiteland" },
  ];

  useEffect(() => {
    // ✅ Prevent text selection when clicking swiper buttons
    const preventSelection = (event) => {
      if (event.target.closest(".project-button-next, .project-button-prev")) {
        event.preventDefault();
      }
    };

    document.addEventListener("mousedown", preventSelection);

    return () => {
      document.removeEventListener("mousedown", preventSelection);
    };
  }, []);

  return (
    <div className="featured-section">
      <div className="featured-projects-section text-center">
        <div className="featured-text">Featured Projects</div>
        <div className="featured-text-mob">Featured </div>
        <Swiper
          spaceBetween={0}
          slidesPerView={2.5}
          centeredSlides={false}
          navigation={{
            nextEl: ".project-button-next",
            prevEl: ".project-button-prev",
          }}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 5.5,
              spaceBetween: 20,
              centeredSlides: false,
            },
          }}
        >
          {/* Navigation Arrows */}
          <div className="project-navigation">
            <div
              className="project-button-prev"
              onMouseDown={(e) => e.preventDefault()} // ✅ Prevent selection inline
            >
              <MdArrowBack size={38} />
            </div>
            <div
              className="project-button-next"
              onMouseDown={(e) => e.preventDefault()} // ✅ Prevent selection inline
            >
              <MdArrowForward size={38} />
            </div>
          </div>

          {featuredImages.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="featured-image">
                <Link to={`/all-projects/${project.name}`}>
                  <img src={project.image} alt={`Project ${index + 1}`} />
                  <div id="icon-overlay" className="icon-overlay">
                    <MdArrowOutward size={34} color="white" />
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          id="project-button"
          className="hover-button"
          onClick={() => {
            window.scrollTo(0, 0); // Scroll to top
            navigate("/all-projects");
          }}
        >
          <span>See All Projects</span>
        </button>
      </div>
    </div>
  );
};

export default Features;
