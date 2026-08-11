
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

import "./Features.css";

// ImageKit image URLs
const Miraj =
  "https://ik.imagekit.io/ylx9qggcp/miraj.webp?updatedAt=1776152244497";

const ScaledSymphony =
  "https://ik.imagekit.io/ylx9qggcp/Sculpted%20Silence.webp?updatedAt=1776152389797";

const Whiteland =
  "https://ik.imagekit.io/ylx9qggcp/whiteland.webp?updatedAt=1776152244798";

const RJ =
  "https://ik.imagekit.io/ylx9qggcp/RJ.webp?updatedAt=1776152244291";

const ABJewels =
  "https://ik.imagekit.io/ylx9qggcp/AB.webp?updatedAt=1776152244136";

const Obsidian =
  "https://ik.imagekit.io/ylx9qggcp/obsidian.webp?updatedAt=1776152244469";

const Fortis =
  "https://ik.imagekit.io/ylx9qggcp/Fortis.webp?updatedAt=1776152244197";

const KineticGrid =
  "https://ik.imagekit.io/ylx9qggcp/Kinetic%20Grid.webp?updatedAt=1776152244481";

const IMAGE_WIDTH = 420;
const IMAGE_GAP = 2;

const Features = () => {
  const [isSliderActive, setIsSliderActive] = useState(false);

  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const rowRef = useRef(null);
  const nextSectionRef = useRef(null);

  const scrollXRef = useRef(0);
  const rafRef = useRef(null);

  /*
   * Featured project images.
   */
  const featuredImages = useMemo(
    () => [
      Miraj,
      ScaledSymphony,
      Whiteland,
      RJ,
      ABJewels,
      Obsidian,
      Fortis,
      KineticGrid,
    ],
    []
  );

  /*
   * Duplicate images to create
   * the horizontal scrolling experience.
   */
  const clonedImages = useMemo(
    () => [...featuredImages, ...featuredImages],
    [featuredImages]
  );

  const totalImages = featuredImages.length;

  /*
   * Maximum horizontal scroll distance.
   */
  const maxScrollX = useMemo(
    () =>
      totalImages * IMAGE_WIDTH +
      (totalImages - 1) * IMAGE_GAP,
    [totalImages]
  );

  /*
   * Apply transform directly to the DOM.
   *
   * This prevents React re-rendering
   * during every wheel event.
   */
  const applyTransform = useCallback(() => {
    if (!rowRef.current) return;

    rowRef.current.style.transform = `translate3d(-${scrollXRef.current}px, 0, 0)`;
  }, []);

  /*
   * Detect when Featured section
   * enters the viewport.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSliderActive(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Handle horizontal wheel interaction.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !isSliderActive) return;

    const handleScroll = (event) => {
      /*
       * Prevent normal page scrolling
       * while Featured slider is active.
       */
      event.preventDefault();

      /*
       * Convert vertical mouse wheel
       * movement into horizontal movement.
       */
      const scrollAmount = event.deltaY * 0.3;

      let newScrollX =
        scrollXRef.current + scrollAmount;

      /*
       * Reached the beginning.
       *
       * Allow the user to return to
       * the previous section.
       */
      if (
        newScrollX <= 0 &&
        event.deltaY < 0
      ) {
        scrollXRef.current = 0;

        applyTransform();

        window.scrollBy({
          top: -window.innerHeight,
          behavior: "smooth",
        });

        return;
      }

      /*
       * Reached the end.
       *
       * Move to the next section.
       */
      if (newScrollX >= maxScrollX) {
        scrollXRef.current = maxScrollX;

        applyTransform();

        nextSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return;
      }

      /*
       * Keep scroll position inside
       * allowed boundaries.
       */
      scrollXRef.current = Math.max(
        0,
        Math.min(newScrollX, maxScrollX)
      );

      /*
       * Update DOM only once per
       * animation frame.
       */
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          applyTransform();
          rafRef.current = null;
        });
      }
    };

    section.addEventListener("wheel", handleScroll, {
      passive: false,
    });

    return () => {
      section.removeEventListener(
        "wheel",
        handleScroll
      );

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    isSliderActive,
    maxScrollX,
    applyTransform,
  ]);

  return (
    <>
      <section
        ref={sectionRef}
        className="featured-section"
      >
        <div
          ref={wrapperRef}
          className="featured-wrapper"
        >
          <div className="featured-heading">
            <h2>Featured</h2>
          </div>

          <div
            className="featured-row"
            ref={rowRef}
            style={{
              transform: "translate3d(0, 0, 0)",
              willChange: isSliderActive
                ? "transform"
                : "auto",
            }}
          >
            {clonedImages.map(
              (image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Featured Metaguise project ${
                    (index % totalImages) + 1
                  }`}
                  width={IMAGE_WIDTH}
                  height={Math.round(
                    IMAGE_WIDTH * 0.75
                  )}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  draggable="false"
                />
              )
            )}
          </div>

          <div className="featured-project-link">
            <a href="/projects/">
              See All Projects
            </a>
          </div>
        </div>
      </section>

      <div
        ref={nextSectionRef}
        style={{
          height: "0",
          background: "#f8f9fa",
        }}
      />
    </>
  );
};

export default Features;

