import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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

const IMAGE_WIDTH = 420; // Adjust based on actual image width
const IMAGE_GAP = 2; // Gap between images as set in CSS

const Features = () => {
  // isSliderActive still triggers a (rare) re-render when the section
  // enters/leaves view — that's fine, it only fires a couple of times.
  const [isSliderActive, setIsSliderActive] = useState(false);

  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const rowRef = useRef(null); // NEW — direct DOM handle for the transform
  const nextSectionRef = useRef(null);

  // scrollX now lives in a ref, not state — updating it on every wheel
  // tick no longer re-renders the component or remaps the image list.
  const scrollXRef = useRef(0);
  const rafRef = useRef(null);

  const featuredImages = useMemo(
    () => [Miraj, ScaledSymphony, Whiteland, RJ, ABJewels, Obsidian, Fortis, KineticGrid],
    []
  );
  const clonedImages = useMemo(
    () => [...featuredImages, ...featuredImages],
    [featuredImages]
  );
  const totalImages = featuredImages.length;
  const maxScrollX = useMemo(
    () => totalImages * IMAGE_WIDTH + (totalImages - 1) * IMAGE_GAP,
    [totalImages]
  );

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = '');

  // Applies the current ref value to the DOM directly — no React render.
  const applyTransform = useCallback(() => {
    if (rowRef.current) {
      rowRef.current.style.transform = `translateX(-${scrollXRef.current}px)`;
    }
  }, []);

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
      { threshold: 1.0 }
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

      const scrollAmount = event.deltaY * 0.3;
      let newScrollX = scrollXRef.current + scrollAmount;

      if (newScrollX <= 0 && event.deltaY < 0) {
        scrollXRef.current = 0;
        applyTransform();
        unlockScroll();
        window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        return;
      }

      if (newScrollX >= maxScrollX) {
        scrollXRef.current = maxScrollX;
        applyTransform();
        nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        unlockScroll();
        return;
      }

      scrollXRef.current = Math.max(0, Math.min(newScrollX, maxScrollX));

      // Batch the DOM write into the next animation frame instead of
      // writing on every single wheel event (avoids layout thrashing).
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          applyTransform();
          rafRef.current = null;
        });
      }
    };

    const section = sectionRef.current;
    if (isSliderActive && section) {
      section.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (section) section.removeEventListener('wheel', handleScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isSliderActive, maxScrollX, applyTransform]);

  return (
    <>
      <div className="featured-section" ref={sectionRef}>
        <Container className="featured-projects-section text-center">
          <div className="featured-text">Featured </div>
          <div className="featured-row-wrapper" ref={wrapperRef}>
            <div
              className="featured-row"
              ref={rowRef}
              style={{
                transform: 'translateX(0px)',
                willChange: 'transform',
              }}
            >
              {clonedImages.map((image, index) => (
                <div className="featured-image" key={index}>
                  <img
                    src={image}
                    alt={`Project ${index + 1}`}
                    width={IMAGE_WIDTH}
                    // First couple of images are visible immediately —
                    // load those eagerly, lazy-load the rest so the
                    // browser isn't fetching all 16 at once on mount.
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
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