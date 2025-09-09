import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import LazyLoad from "react-lazy-load"; // Lazy Load Import
import "./Brochure.css";
import { MdArrowOutward } from "react-icons/md";
import Metaform from "../assets/Brochures/formopen.jpg";
import Metafunction from "../assets/Brochures/functionopen.jpg";
import Metaparametric from "../assets/Brochures/parametricopen.jpg";
import Metasurface from "../assets/Brochures/patinaopen.jpg";

const Brochure = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const gallery = [
    { src: Metaform, name: "MetaForm", path: "/metaform", alt: "Close-up of horizontal MetaLouvers with a green houseplant peeking out and an underceiling with solid panels." },
    { src: Metafunction, name: "MetaFunction", path: "/metafunction", alt: "Tall vertical MetaLouvers in a MetaFold Syetem on a residential facade providing shading and privacy." },
    { src: Metaparametric, name: "MetaParametric", path: "/metaparametric", alt: "Sharp-edged corner view of the Tanishq facade clad in custom MetaCoin panels with the blue sky and a plan flying above." },
    { src: Metasurface, name: "MetaSurface", path: "/metasurface", alt: "Circular MetaPatina panels with a hand-finished copper oxide texture in green and bronze tones." },
  ];

  return (
    <div className="container">
      <h1 className="brochure-title">Our Brochures</h1>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          {gallery.map((item, index) => (
            <div
              key={index}
              className={`brochure-grid-item ${
                hoveredIndex === index ? "col-md-6" : "col-md-2"
              } `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(item.path);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="image-brochure-container">
                <LazyLoad
                  height={"100%"}
                  offset={200}
                  debounce={500}
                  placeholder={<div className="image-placeholder"></div>}
                >
                  {/* ✅ Alt tag added for all brochure images */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="img-fluid"
                    loading="lazy"
                  />
                </LazyLoad>
                <div className="brochure-overlay">
                  {item.name} <MdArrowOutward />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-1"></div>
      </div>
    </div>
  );
};

export default Brochure;
