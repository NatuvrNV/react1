import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import LazyLoad from "react-lazy-load"; // Lazy Load Import
import "./Brochure.css";
import { MdArrowOutward } from "react-icons/md";

const Brochure = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  // ✅ Use Cloudinary URLs directly (optimized with f_auto,q_auto,w_auto,dpr_auto)
  const gallery = [
    {
      src: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/v1758100922/formopen.e10d81d1844910268f40_pfptyn.jpg",
      name: "MetaForm",
      path: "/metaform",
      alt: "Close-up of horizontal MetaLouvers with a green houseplant peeking out and an underceiling with solid panels."
    },
    {
      src: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/v1758100922/functionopen.d63b1c920c02ee1672a2_txs7mt.jpg",
      name: "MetaFunction",
      path: "/metafunction",
      alt: "Tall vertical MetaLouvers in a MetaFold Syetem on a residential facade providing shading and privacy."
    },
    {
      src: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/v1758100922/parametricopen.91060c3bc34ba929e9c5_cejsrf.jpg",
      name: "MetaParametric",
      path: "/metaparametric",
      alt: "Sharp-edged corner view of the Tanishq facade clad in custom MetaCoin panels with the blue sky and a plan flying above."
    },
    {
      src: "https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_auto,dpr_auto/v1758100921/patinaopen.91c7361f12b6726d1b87_ggd9fy.jpg",
      name: "MetaSurface",
      path: "/metasurface",
      alt: "Circular MetaPatina panels with a hand-finished copper oxide texture in green and bronze tones."
    }
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
