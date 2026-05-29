import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './Features.css';
import Miraj from "../assets/featured/miraj.webp";
import ScaledSymphony from "../assets/featured/scaled.webp";
import Whiteland from "../assets/featured/whiteland.webp";
import RJ from "../assets/featured/RJ.webp";
import ABJewels from "../assets/featured/AB.webp";
import Obsidian from "../assets/featured/obsidian.webp";
import Fortis from "../assets/featured/Fortis.webp";
import KineticGrid from "../assets/featured/Kinetic Grid.webp";

const Features = () => {
  const [scrollX, setScrollX] = useState(0);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const nextSectionRef = useRef(null); // Ref for the next section
  const featuredImages = [
    Miraj, ScaledSymphony, Whiteland, RJ,
    ABJewels, Obsidian, Fortis, KineticGrid
  ];
  const clonedImages = [...featuredImages, ...featuredImages];
  const imageWidth = 420; // Adjust based on actual image width
  const imageGap = 2; // This is the gap between images as set in CSS
  const totalImages = clonedImages.length / 2; // Only count the unique set of images

  const maxScrollX = (totalImages * imageWidth) + ((totalImages - 1) * imageGap);

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSliderActive(true);
            lockScroll();
          } else {
            setIsSliderActive(false);
            unlockScroll();
          }
        });
      },
      { threshold: 1.0 } // Trigger when 100% of the element is visible
    );

    const currentRef = wrapperRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      if (!isSliderActive) return;
      event.preventDefault();

      const scrollAmount = event.deltaY * 0.3; // Smooth scroll
      setScrollX((prevScrollX) => {
        let newScrollX = prevScrollX + scrollAmount;

        if (newScrollX <= 0 && event.deltaY < 0) {
          unlockScroll();
          window.scrollBy({
            top: -window.innerHeight,
            behavior: 'smooth',
          });
          return 0;
        }

        if (newScrollX >= maxScrollX) {
          nextSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          unlockScroll();
          return maxScrollX;
        }

        return Math.max(0, Math.min(newScrollX, maxScrollX));
      });
    };

    const section = sectionRef.current;
    if (isSliderActive) {
      section.addEventListener('wheel', handleScroll, { passive: false });
    } else {
      section.removeEventListener('wheel', handleScroll);
    }

    return () => {
      section.removeEventListener('wheel', handleScroll);
    };
  }, [isSliderActive, maxScrollX]);

  return (
    <>
      <div className="featured-section" ref={sectionRef}>
        <Container className="featured-projects-section text-center">
          <div className="featured-text">Featured </div>
          <div className="featured-row-wrapper" ref={wrapperRef}>
            <div
              className="featured-row"
              style={{
                transform: `translateX(-${scrollX }px)`,
                transition: 'transform 0.5s ease',
              }}
            >
              {clonedImages.map((image, index) => (
                <div className="featured-image" key={index}>
                  <img src={image} alt={`Project ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <button className="hover-button" aria-label="See all projects">
            <span>See All Projects</span>
          </button>
        </Container>
      </div>

      {/* Next Section */}
      <div ref={nextSectionRef} style={{ height: '0vh', background: '#f8f9fa' }}>
      </div>
    </>
  );
};

export default Features;
