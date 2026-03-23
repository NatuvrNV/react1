import React, { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet-async";

// 1. Critical Components: Load immediately (keep these as standard imports)
import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';

// 2. Lazy Components: These are split into separate small files
const FloatingButton = lazy(() => import("../../components/Floatingbutton"));
const MetaExperience1 = lazy(() => import('../../components/MetaExperience1'));
const Product = lazy(() => import('../../components/Product'));
const Metaland = lazy(() => import('../../components/Metaland'));
const Brochure = lazy(() => import('../../components/Brochure'));
const Cofee = lazy(() => import('../../components/Cofee'));
const Footer = lazy(() => import('../../components/Footer'));

function Home() {
  return (
    <div className='Home'>
      <Helmet>

        <title>Metaguise | India’s Leading Experts in Luxury Metal Facades</title>

        <meta
          name="description"
          content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/" />
        <link rel="icon" href="https://metaguise.com/favicon.ico" />
         <meta property="og:image" content="https://metaguise.com/favicon.ico" />
         <meta property="og:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades"/>
<meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India."/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://metaguise.com/"/>
<meta property="og:site_name" content="Metaguise"/>
<meta property="og:image" content="https://ik.imagekit.io/ylx9qggcp/1.webp"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="Luxury Parametric Metal Facade Design by Metaguise"/>
<meta property="og:locale" content="en_IN"/>

<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades"/>
<meta name="twitter:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India."/>
<meta name="twitter:image" content="https://ik.imagekit.io/ylx9qggcp/1.webp"/>
<meta name="twitter:url" content="https://metaguise.com/"/>

  <noscript>
    {`
  
  <div>
  <h1>Metaguise — India's Leading Metal Facade Company</h1>
  <p>Metaguise is India's premier metal facade specialist based in Gurugram, Haryana. We design and install luxury parametric metal facades, architectural cladding, and custom metal elevations for residential and commercial buildings across India. 1800+ projects delivered pan-India since 2019.</p>

  <h2>Our Services</h2>
  <ul>
    <li>Metal Facade Design and Installation</li>
    <li>Parametric Facade Design</li>
    <li>Architectural Metal Cladding</li>
    <li>Metal Elevation for Buildings</li>
    <li>Retrofit Metal Facades</li>
  </ul>

  <h2>Our Products</h2>
  <p>MetaCoin, MetaSequin, Cascading Keys, MetaShingles, MetaFlute, MetaLouver, MetaCassette, MetaWood, MetaPatina, MetaCorten, MetaPyramid, MetaFold, MetaFin, MetaHydra, MetaPlank, MetaGate, MetaSlider, MetaBlox, MetaCopper, MetaGrey, Solid Panel</p>

  <h2>Featured Projects</h2>
  <p>Studio Ardete HQ, Kinetic Grid, Obsidian, RJ Jewellers, Luxe Manor, Scaled Symphony, Zenith, Whiteland, Tanishq Jewellery, Fortis Hospital, Miraj Stadium, Sacred Geometry, Peacock Mesh — and 100+ more projects pan-India.</p>

  <h2>Location</h2>
  <p>Headquartered in Gurugram, Haryana. Metaland Experience Center: Basement Floor, K9/46, DLF Phase 2, Gurugram. Serving Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Jaipur, Kolkata, Chandigarh and all major cities across India.</p>

  <h2>Contact</h2>
  <p>Phone: +91-9811604449 | Email: contactus@metaguise.com | Website: https://metaguise.com</p>
</div>
    `}
  </noscript>
      
      </Helmet>

      {/* Above the fold: Loads instantly */}
      <Swipper />
      <Featured />

      {/* 3. Suspense wrapper: The layout stays the same, 
          but these components only load after the hero is ready */}
      <Suspense fallback={null}>
        <FloatingButton />
        <MetaExperience1 />
        <Product />
        <Metaland />
        <Brochure />
        <Cofee />
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;