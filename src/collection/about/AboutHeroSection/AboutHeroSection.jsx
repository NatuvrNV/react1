import React from "react";
import AboutHero from "../../../assets/about/about-hero.png";
import styles from "./AboutHeroSection.module.css";

export const AboutHeroSection = () => {
  const paragraphss = [
    "Metaguise is India’s leading metal facade design and execution company, delivering precision and high-performance engineered building exteriors across residential, commercial, and institutional projects. As pioneers of parametric architecture in the country, we transform advanced computational design into bespoke, state-of-the-art metal facade systems.",
    "With over 1800+ completed projects across India and a growing global presence, we work closely with architects, developers, and homeowners to design, develop, and install facade systems that enhance both the appearance and performance of a building.",
    "Founded on Shri Deepak Raheja’s vision, Metaguise was built on the principle that a building’s identity is judged, defined, and remembered by its facade, and that it must be designed and executed with rigour and intent. What began as a focused facade studio has grown into a full-scale, in-house operation, supported by a team of 70+ specialists - bringing together design, parametrics, engineering, fabrication, and installation under one roof. Our team has now successfully delivered high end residences, commercial projects, high rise podiums and institutional projects like Cricket Stadiums, Universities and Public Infrastructure.",
    "Our work spans a wide range of metal facade solutions - from solid aluminium panels, perforated screens and kinetic facade systems to performance-driven technologies, advanced parametric and custom built facade systems - where each project is developed with attention to detail, climate responsiveness, and long-term durability, ensuring it performs reliably for years to come.",
    "At Metaguise, we don’t approach facades as surface elements - we design them as an integral part of the architecture. The first and last impression of your building!"
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
          alt="An image of the facade of Metaland featuring the white MetaSequin panels forming the tree of knowledge pattern "
          className={styles.heroImage}
          loading="eager"
        />
      </div>
    </section>
  );
};
