import React from "react";
import AboutHero from "../../../assets/about/about-hero.png";
import styles from "./AboutHeroSection.module.css";

export const AboutHeroSection = () => {
  const paragraphss = [
    "Metaguise is a story of resilience, renewal, and limitless ambition. Like a phoenix rising from adversity, our journey has been one of transformation: overcoming challenges to become a symbol of architectural innovation.",
    'Founded by visionary chairman Shri Deepak Raheja, Metaguise operates on the belief that "Anything is Possible." This philosophy drives every initiative, not only building structures but also crafting spaces that blend speed, strength, and creativity—leaving lasting legacies in infrastructure.',
    "At the heart of our innovation is parametric facade technology, which merges complex geometries with advanced materials to produce visually striking and dynamic exteriors. This cutting-edge approach allows us to break creative boundaries, setting new standards in architecture.",
    "As we continue our journey, Metaguise rises to every challenge—our spirit as unyielding as the phoenix, always reaching new heights.",
  ];

  return (
    <section className={styles.aboutHeroContainer}>
      <div id="about-tittle" className={styles.contentSection}>
        <h1>About Us</h1>
        {paragraphss.map((text, index) => (
          <p key={index} className={styles.paragraph}>
            {text}
          </p>
        ))}
      </div>
      <div className={styles.imageSection}>
        <img
          src={AboutHero}
          alt="Metaguise architectural innovation"
          className={styles.heroImage}
          loading="eager"
        />
      </div>
    </section>
  );
};
