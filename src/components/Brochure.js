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
    { src: Metaform, name: "MetaForm", path: "/metaform" },
    { src: Metafunction, name: "MetaFunction", path: "/metafunction" },
    { src: Metaparametric, name: "MetaParametric", path: "/metaparametric" },
    { src: Metasurface, name: "MetaSurface", path: "/metasurface" },
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
                {/* Ensure the height and width stay fixed while loading */}
                <LazyLoad 
                  height={"100%"}  // Set height based on container
                  offset={200} // Start loading slightly before visible
                  debounce={500} // Reduce unnecessary re-renders
                  placeholder={<div className="image-placeholder"></div>} // Placeholder for smooth transition
                >
                  <img src={item.src} alt={item.name} className="img-fluid" />
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
