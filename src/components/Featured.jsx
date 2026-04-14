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

const featuredImages = [
    {
      image: "https://ik.imagekit.io/ylx9qggcp/miraj.webp",
      displayName: "Miraj Stadium",
      urlSlug: "miraj-stadium",
      alt: "Modern commercial facade design by Metaguise featuring perforated metal cladding elevation with contemporary architectural branding concept",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/f6.webp",
      displayName: "Scaled Symphony",
      urlSlug: "3939a",
      alt: "Luxury residential elevation design with modern geometric facade, premium exterior architecture and custom metal facade detailing by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/f8.webp",
      displayName: "Whiteland",
      urlSlug: "whiteland",
      alt: "Corporate building elevation with glass facade and metal cladding system showcasing modern commercial architecture by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/Sculpted%20Silence.webp",
      displayName: "Sculpted Silence",
      urlSlug: "sculpted-silence",
      alt: "Minimalist luxury residence elevation with sculptural facade elements, modern exterior design and architectural facade detailing by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/AB.webp",
      displayName: "AB Jewels",
      urlSlug: "ab-jewels",
      alt: "AB Jewels commercial showroom facade featuring gold textured metal cladding elevation and iconic retail building exterior design by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/f3.webp",
      displayName: "Obsidian",
      urlSlug: "vivek",
      alt: "Contemporary black facade residential architecture with modern elevation design, layered exterior volumes and premium facade materials by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/Fortis.webp",
      displayName: "Fortis",
      urlSlug: "fortis",
      alt: "Large institutional building elevation with artistic facade mural and modern architectural cladding design developed by Metaguise",
    },
    {
      image: "https://ik.imagekit.io/ylx9qggcp/f2.webp",
      displayName: "Kinetic Grid",
      urlSlug: "caskey",
      alt: "Parametric metal facade system with kinetic grid pattern showcasing innovative commercial elevation design by Metaguise",
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
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                  />
                  <div id="icon-overlay" className="icon-overlay">
                    <MdArrowOutward size={34} color="white" />
                  </div>
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