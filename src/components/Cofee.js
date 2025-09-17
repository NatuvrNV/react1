import React from "react";
import "./Cofee.css";
import { useNavigate } from "react-router-dom";

const Cofee = () => {
  const navigate = useNavigate();

  return (
    <div className="cofee-container">
      <main className="cofee-content">
        <div className="cofee-section">
          <h1>Get our Coffee Table Book.</h1>
          <button
            id="download-button"
            className="hover-button"
            onClick={() => {
              window.scrollTo(0, 0); // Scroll to top
              navigate("/ctb");
            }}
          >
            <span>Download</span>
          </button>
        </div>

        <div className="image-section">
          <img
            src="https://res.cloudinary.com/dptxcqnnw/image/upload/f_auto,q_auto,w_800/v1758101791/cover.5be3ada55864939a96cc_ieymmt.png"
            alt="Cover of Metaguise Odyssey book featuring a sculpted metallic wing motif in bronze tones."
            loading="lazy"
          />
        </div>
      </main>
    </div>
  );
};

export default Cofee;
