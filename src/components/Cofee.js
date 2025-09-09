import React from "react";
import "./Cofee.css";
import { useNavigate } from "react-router-dom";
import bookCover from "../assets/cover.png"; // Static import

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
            src={bookCover}
            alt="Cover of Metaguise Odyssey book featuring a sculpted metallic wing motif in bronze tones."
            loading="lazy" // Native lazy loading
          />
        </div>
      </main>
    </div>
  );
};

export default Cofee;
