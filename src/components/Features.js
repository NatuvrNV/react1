import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Features.css";
import { useEffect, useState } from "react";
import OptimizedImage from "./OptimizedImage";

// ImageKit-hosted images — replaces the old static /assets/Featured/*.webp
// imports so these ship through the same CDN/transform pipeline as the
// rest of the site (resizing, format negotiation, caching) instead of
// being bundled as static assets.
const Miraj = "https://ik.imagekit.io/ylx9qggcp/miraj.webp?updatedAt=1776152244497";
const ScaledSymphony = "https://ik.imagekit.io/ylx9qggcp/Sculpted%20Silence.webp?updatedAt=1776152389797";
const Whiteland = "https://ik.imagekit.io/ylx9qggcp/whiteland.webp?updatedAt=1776152244798";
const RJ = "https://ik.imagekit.io/ylx9qggcp/RJ.webp?updatedAt=1776152244291";
const ABJewels = "https://ik.imagekit.io/ylx9qggcp/AB.webp?updatedAt=1776152244136";
const Obsidian = "https://ik.imagekit.io/ylx9qggcp/obsidian.webp?updatedAt=1776152244469";
const Fortis = "https://ik.imagekit.io/ylx9qggcp/Fortis.webp?updatedAt=1776152244197";
const KineticGrid = "https://ik.imagekit.io/ylx9qggcp/Kinetic%20Grid.webp?updatedAt=1776152244481";

// Card render size — these slides are ~420px wide at desktop breakpoint
// (5.5 per view) and narrower on mobile (2.5 per view). 420x315 (4:3) is
// used as the intrinsic width/height so the browser can reserve layout
// space before the image loads, preventing CLS either way.
const IMG_WIDTH = 420;
const IMG_HEIGHT = 315;

// ImageKit transform helper — resizes + forces webp + sets quality,
// same pattern used in Swiper.jsx for the hero banner.
const buildSrc = (base, width) => `${base}?tr=w-${width},q-80,f-webp`;

const featuredImages = [
  {
    image: Miraj,
    displayName: "Miraj Stadium",
    urlSlug: "miraj-stadium",
    alt: "Modern commercial facade design by Metaguise featuring perforated metal cladding elevation with contemporary architectural branding concept",
  },
  {
    image: ScaledSymphony,
    displayName: "Scaled Symphony",
    urlSlug: "3939a",
    alt: "Luxury residential elevation design with modern geometric facade, premium exterior architecture and custom metal facade detailing by Metaguise",
  },
  {
    image: Whiteland,
    displayName: "Whiteland",
    urlSlug: "whiteland",
    alt: "Corporate building elevation with glass facade and metal cladding system showcasing modern commercial architecture by Metaguise",
  },
  {
    image: RJ,
    displayName: "RJ Jewelers",
    urlSlug: "rj-jewellers",
    alt: "Minimalist luxury residence elevation with sculptural facade elements, modern exterior design and architectural facade detailing by Metaguise",
  },
  {
    image: ABJewels,
    displayName: "AB Jewels",
    urlSlug: "ab-jewels",
    alt: "AB Jewels commercial showroom facade featuring gold textured metal cladding elevation and iconic retail building exterior design by Metaguise",
  },
  {
    image: Obsidian,
    displayName: "Obsidian",
    urlSlug: "vivek",
    alt: "Contemporary black facade residential architecture with modern elevation design, layered exterior volumes and premium facade materials by Metaguise",
  },
  {
    image: Fortis,
    displayName: "Fortis",
    urlSlug: "fortis",
    alt: "Large institutional building elevation with artistic facade mural and modern architectural cladding design developed by Metaguise",
  },
  {
    image: KineticGrid,
    displayName: "Kinetic Grid",
    urlSlug: "caskey",
    alt: "Parametric metal facade system with kinetic grid pattern showcasing innovative commercial elevation design by Metaguise",
  },
];

const Features = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
                {/* Trailing slash added to match sitewide URL convention (Task 4) */}
                <Link to={`/all-projects/${project.urlSlug}/`}>
                  <OptimizedImage
                    src={buildSrc(project.image, IMG_WIDTH)}
                    srcSet={`
                      ${buildSrc(project.image, 320)} 320w,
                      ${buildSrc(project.image, 420)} 420w,
                      ${buildSrc(project.image, 640)} 640w
                    `}
                    sizes="(max-width: 640px) 40vw, 18vw"
                    alt={project.alt}
                    width={IMG_WIDTH}
                    height={IMG_HEIGHT}
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
            navigate("/all-projects/");
          }}
        >
          <span>See All Projects</span>
        </button>
      </div>
    </div>
  );
};

export default Features;