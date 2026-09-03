import React from "react";
import "./Cofee.css";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import CoffeeImage from "../assets/coffeetablebook.webp";


const Cofee = () => {
  const navigate = useNavigate();

  return (
    <div className="cofee-container">
      <main className="cofee-content">
        <div className="cofee-section">
          <h2>Get our Coffee Table Book.</h2>
          <button
            id="download-button"
            className="hover-button"
            onClick={() => {
              window.scrollTo(0, 0); // Scroll to top
              navigate("/ctb/");
            }}
          >
            <span>Download</span>
          </button>
        </div>

        <div className="image-section">
          <OptimizedImage
            src={CoffeeImage}
            alt="Cover of Metaguise Odyssey book featuring a sculpted metallic wing motif in bronze tones."
            width={500}
            height={650}
          />
        </div>
      </main>
    </div>
  );
};

export default Cofee;