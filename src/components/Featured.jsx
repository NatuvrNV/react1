import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md"; 
import { useNavigate, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Features.css";
import { useEffect, useState } from "react";

const Features = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // ✅ Use Cloudinary URLs directly with separate display names and URL slugs
  const featuredImages = [
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f5_qxkpfe.webp", 
      displayName: "Studio Ardete HQ",
      urlSlug: "ardete"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f7_y1ifpm.webp", 
      displayName: "Kinetic Grid",
      urlSlug: "caskey"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f3_uyfv39.webp", 
      displayName: "Obsidian",
      urlSlug: "vivek"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f8_unuj4n.webp", 
      displayName: "RJ Jewellers",
      urlSlug: "rjjewellers"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f6_kb4dxy.webp", 
      displayName: "Luxe Manor",
      urlSlug: "luxe"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f2_kym96e.webp", 
      displayName: "Scaled Symphony",
      urlSlug: "3939a"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f4_cebj45.webp", 
      displayName: "Zenith ",
      urlSlug: "zenith"
    },
    { 
      image: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/f1_cxmeie.webp", 
      displayName: "Whiteland ",
      urlSlug: "whiteland"
    },
  ];

  useEffect(() => {
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
            <div className="project-button-prev" onMouseDown={(e) => e.preventDefault()}>
              <MdArrowBack size={38} />
            </div>
            <div className="project-button-next" onMouseDown={(e) => e.preventDefault()}>
              <MdArrowForward size={38} />
            </div>
          </div>

          {featuredImages.map((project, index) => (
            <SwiperSlide key={index}>
              <div 
                className="featured-image"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={`/all-projects/${project.urlSlug}`}>
                  {/* ✅ Lazy load + optimized Cloudinary image */}
                  <img
                    src={project.image}
                    alt={`Project ${project.displayName}`}
                    loading="lazy"
                  />
                  <div id="icon-overlay" className="icon-overlay">
                    <MdArrowOutward size={34} color="white" />
                  </div>
                  {/* Project Name Overlay - shows displayName */}
                  <div className={`project-name-overlay ${hoveredIndex === index ? 'active' : ''}`}>
                    <span className="project-name-text">{project.displayName}</span>
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
            window.scrollTo(0, 0);
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
