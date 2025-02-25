import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdArrowBack, MdArrowForward } from "react-icons/md"; // Import your arrow icons
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Features.css";
import Featured1 from "../assets/Featured/f1.webp";
import Featured2 from "../assets/Featured/f2.webp";
import Featured3 from "../assets/Featured/f3.webp";
import Featured4 from "../assets/Featured/f4.webp";
import Featured5 from "../assets/Featured/f5.webp";
import Featured6 from "../assets/Featured/f6.webp";
import Featured7 from "../assets/Featured/f7.webp";
import Featured8 from "../assets/Featured/f8.webp";
import { MdArrowOutward } from "react-icons/md";
import { Link } from 'react-router-dom';


const Features = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const featuredImages = [
    { image: Featured1, name: "ardete" },
    { image: Featured2, name: "tanishq" },
    { image: Featured3, name: "yashika" },
    { image: Featured4, name: "metaland" },
    { image: Featured5, name: "a13-43" },
    { image: Featured6, name: "gowri" },
    { image: Featured7, name: "deepak" },
    { image: Featured8, name: "c76" },
  ];




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
            nextEl: '.project-button-next',
            prevEl: '.project-button-prev',
          }}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 5.5,
              spaceBetween: 20,
              centeredSlides: false
            }
          }}
        >

                     {/* Navigation Arrows */}
                     <div className="project-navigation">
          <div className="project-button-prev">
          <MdArrowBack size={38} />
          </div>
          <div className="project-button-next">
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

      

        
          <button   id="project-button" 
  className="hover-button" 
  onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/all-projects"); }}>
            <span>See All Projects</span>
          </button>
       
      </div>
    </div>
  );
};

export default Features;
