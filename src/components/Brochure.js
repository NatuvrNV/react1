import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import "./Brochure.css";
import { MdArrowOutward } from "react-icons/md";
import Brochure1 from "../assets/Brochures/formopen.jpg";
import Brochure2 from "../assets/Brochures/functionopen.jpg";
import Brochure3 from "../assets/Brochures/parametricopen.jpg";
import Brochure4 from "../assets/Brochures/patinaopen.jpg";

const Brochure = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  // Cloudinary URLs with ImageKit optimization
  const gallery = [
    {
      src: Brochure1,
      name: "MetaForm",
      path: "/metaform",
      alt: "MetaForm architectural facade system brochure cover"
    },
    {
      src: Brochure2,
      name: "MetaFunction",
      path: "/metafunction",
      alt: "MetaFunction facade system brochure cover"
    },
    {
      src: Brochure3,
      name: "MetaParametric",
      path: "/metaparametric",
      alt: "MetaParametric facade system brochure cover"
    },
    {
      src: Brochure4,
      name: "MetaSurface",
      path: "/metasurface",
      alt: "MetaSurface brochure showing patina metal textures"
    }
  ];

  return (
    <div className="container">
      <h2 className="brochure-title">Our Brochures</h2>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          {gallery.map((item, index) => (
            <div
              key={index}
              className={`brochure-grid-item ${
                hoveredIndex === index ? "col-md-6" : "col-md-2"
              }`}
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