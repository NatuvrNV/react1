import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPhone } from "react-icons/fa";
import Logo from "../assets/logo.png"; // ✅ Import your logo properly
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import Archello_icon from "../assets/Archello_icon.png";
import AdProIcon from "../assets/ADprowhite.png";


import Drawer from "./Drawer";

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable body scroll when the drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  return (
    <div>
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        {!isMobile && (
          <div className="header-left">
            <div className="social-icons">
              <a
                href="https://www.facebook.com/metaguise"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
                  alt="Connect with Metaguise on Facebook - Showcasing iconic facades with global presence and design leadership."
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/metaguise/"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
                   alt="Watch Metaguise on YouTube - Discover facade innovation from India’s most trusted name in metal architecture."
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://www.youtube.com/@metaguise"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
                   alt="Follow Metaguise on Instagram - Trusted by architects across India and beyond, with 1800+ projects delivered PAN India."
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>

                  {/* Archello */}
              <a
                href="https://archello.com/brand/metaguise"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
                aria-label="View Metaguise on Archello"
              >
            <img
  src={Archello_icon}
  alt="Archello icon - Visit Metaguise on Archello, the global architecture and design network."
  className="archello-icon"
/>
              </a>

                      {/* ADPro */}
              <a
                href="https://www.architecturaldigest.in/adpro/directory/profile/metaguise/"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
                aria-label="View Metaguise on Archello"
              >
            <img
  src={AdProIcon}
  alt="Archello icon - Visit Metaguise on Archello, the global architecture and design network."
  className="archello-icon"
/>
              </a>
            </div>
          </div>
        )}

        <div className="header-left-mob">
          <div className="social-icons">
            <a
              href="https://metaguise.com/contact"
              className="flex items-center text-white-600"
            >
              <FaPhone size={20} className="mr-2 phone-icon" />

            </a>
          </div>
        </div>

        <div className="header-center">
          <a href="/">
            <img src={Logo} alt="Stylized Metaguise logo featuring interlocking geometric blocks in grayscale. Symbol of India’s premier metal façade design house with 1800+ projects, PAN India presence, and global reach; trusted by architects nationwide." className="logo" />
          </a>
        </div>

        <div className="header-right">
          <div className="menu">
            <FontAwesomeIcon icon={faBars} onClick={toggleDrawer} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
