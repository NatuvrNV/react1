import React, { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet-async";

import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';

const FloatingButton = lazy(() => import("../../components/Floatingbutton"));
const MetaExperience1 = lazy(() => import('../../components/MetaExperience1'));
const Product = lazy(() => import('../../components/Product'));
const Metaland = lazy(() => import('../../components/Metaland'));
const Brochure = lazy(() => import('../../components/Brochure'));
const Cofee = lazy(() => import('../../components/Cofee'));
const Footer = lazy(() => import('../../components/Footer'));

const organizationSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "Metaguise",
  "legalName": "Metaguise",
  "url": "https://metaguise.com/",
  "description": "Metaguise is India's leading metal facade specialist. 1800+ projects delivered pan-India. Specializing in parametric facade design, architectural metal cladding, and custom metal elevations.",
  "logo": "https://ik.imagekit.io/ylx9qggcp/download%20(1).png",
  "image": "https://ik.imagekit.io/ylx9qggcp/1.webp",
  "foundingDate": "2019",
  "priceRange": "₹₹₹",
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+91-9811604449",
    "email": "contactus@metaguise.com",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi"]
  }],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Basement Floor, K9/46, DLF Phase 2",
    "addressLocality": "Gurugram",
    "addressRegion": "Haryana",
    "postalCode": "122002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 28.4595,
    "longitude": 77.0266
  },
  "areaServed": ["Gurugram","Delhi NCR","Mumbai","Bangalore","Chennai","Hyderabad","Pune","Jaipur","India"],
  "sameAs": [
    "https://www.instagram.com/metaguise/",
    "https://www.youtube.com/@metaguise",
    "https://www.facebook.com/metaguise",
    "https://www.linkedin.com/company/metaguise",
    "https://archello.com/brand/metaguise",
    "https://www.architecturaldigest.in/adpro/directory/profile/metaguise/"
  ]
});

const speakableSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", ".slide-content"]
  },
  "url": "https://metaguise.com/"
});

const noscriptContent = `
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
`;

function Home() {
  return (
    <div className='Home'>
      <Helmet>
        <title>Metaguise | India's Leading Experts in Luxury Metal Facades</title>

        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/" />
        <link rel="icon" href="https://metaguise.com/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="Metaguise | India's Leading Experts in Luxury Metal Facades" />
        <meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metaguise.com/" />
        <meta property="og:site_name" content="Metaguise" />
        <meta property="og:image" content="https://ik.imagekit.io/ylx9qggcp/1.webp" />  {/* ✅ Single og:image */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Luxury Parametric Metal Facade Design by Metaguise" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Metaguise | India's Leading Experts in Luxury Metal Facades" />
        <meta name="twitter:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta name="twitter:image" content="https://ik.imagekit.io/ylx9qggcp/1.webp" />
        <meta name="twitter:url" content="https://metaguise.com/" />

        {/* JSON-LD: Organization + LocalBusiness */}
        <script type="application/ld+json">{organizationSchema}</script>

        {/* JSON-LD: Speakable WebPage */}
        <script type="application/ld+json">{speakableSchema}</script>
      </Helmet>

      {/* ✅ Fixed noscript: uses dangerouslySetInnerHTML */}
      <noscript dangerouslySetInnerHTML={{ __html: noscriptContent }} />

      <Swipper />
      <Featured />

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