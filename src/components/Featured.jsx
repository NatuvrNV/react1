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

import Featured1 from "../assets/Featured/tanishq.webp";
import Featured2 from "../assets/Featured/f2.webp";
import Featured3 from "../assets/Featured/f3.webp";
import Featured4 from "../assets/Featured/f4.webp";
import Featured5 from "../assets/Featured/f5.webp";
import Featured6 from "../assets/Featured/f6.webp";
import Featured7 from "../assets/Featured/f7.webp";
import Featured8 from "../assets/Featured/f1.webp";

const Features = () => {
  const navigate = useNavigate();
  const featuredImages = [
    { image: Featured1, name: "tanishq" },
    { image: Featured2, name: "wvcity" },
    { image: Featured3, name: "vivek" },
    { image: Featured4, name: "rjjewellers" },
    { image: Featured5, name: "peachstreet" },
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
