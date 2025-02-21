import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Phone } from "lucide-react";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from "../assets/logo.png";
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
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/metaguise/"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://www.youtube.com/@metaguise"
                target="_blank"
                rel="noopener noreferrer"
                className="icon"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        )}

        <div className="header-left-mob">
          <div className="social-icons">
            <a
              href="http://novaversecollective.com/contact"
              className="flex items-center text-white-600"
            >
              <Phone size={20} className="mr-2" />
            </a>
          </div>
        </div>

        <div className="header-center">
          <a href="/">
            <img src={logo} alt="Metaguise Logo" className="logo" />
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
