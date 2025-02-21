import React, { useEffect, useRef, useState } from 'react';
import './Team.css';
import Team1 from '../assets/Maskgroup.png';
import { useNavigate } from "react-router-dom";
const Team = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="team-section" ref={sectionRef}>
      <div className="team-wrapper">
        <div className="team-image-container">
          <img
            src={Team1}
            alt="Team"
            className={`team-image ${isVisible ? 'active' : ''}`}
          />
        </div>
        <div className={`team-content ${isVisible ? 'active' : ''}`}>
          <h1 className="team-title">Metaguise Snapshot</h1>
         

        
          <button id='team-button' className="hover-button"  onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/about"); }}>
            <span>Our Team</span>
          </button>
    
        </div>
      </div>
    </div>
  );
};

export default Team;