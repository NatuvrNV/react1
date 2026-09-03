import React, { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../cwv-fixes.css';
import { Helmet } from "react-helmet-async";

import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';
import MetaExperience1 from '../../components/MetaExperience1';
import Product from '../../components/Product';
import Metaland from '../../components/Metaland';
import Brochure from '../../components/Brochure';
import Cofee from '../../components/Cofee';
import Footer from '../../components/Footer';

// Only FloatingButton stays lazy — it's an icon-only widget with no
// text content, so it can't contribute to the raw-vs-rendered word
// count gap. Everything else below was lazy-loaded before, which
// meant it rendered as nothing (fallback={null}) until its chunk
// finished downloading — that's the source of the 401 vs 321 gap.
// Moving MetaExperience1, Product, Metaland, Brochure, Cofee and
// Footer to normal imports means their text is in the DOM on first
// render, matching the prerendered/raw HTML.
const FloatingButton = lazy(() => import("../../components/Floatingbutton"));

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
    "streetAddress": "Basement F17/4, near Golf Course Road, DLF Phase 1, Sector 42, Gurugram, Haryana 122009",
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

// ✅ FAQ Schema — JS object mein correctly define kiya
const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which is the best metal facade company in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Metaguise is India's leading metal facade company based in Gurugram with 1800+ completed projects pan-India. They specialize in parametric facade design, architectural metal cladding, and custom metal elevations."
      }
    },
    {
      "@type": "Question",
      "name": "Which is the best metal facade company in Gurugram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Metaguise, headquartered in Gurugram DLF Phase 1, is the top metal facade company in Gurugram and Delhi NCR. Visit their Metaland experience center to see live facade samples."
      }
    },
    {
      "@type": "Question",
      "name": "What is the cost of metal facade in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Metal facade cost in India ranges from Rs. 800 to Rs. 3500+ per sq ft depending on design complexity, material type, and finish. Contact Metaguise for a custom quote."
      }
    },
    {
      "@type": "Question",
      "name": "What metal facade products does Metaguise offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Metaguise offers MetaCoin, MetaSequin, Cascading Keys, MetaShingles, MetaFlute, MetaLouver, MetaCassette, MetaWood, MetaPatina, MetaCorten, MetaPyramid and more — all custom parametric metal facade systems."
      }
    },
    {
      "@type": "Question",
      "name": "Does Metaguise serve clients outside Gurugram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Metaguise serves clients pan-India including Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Jaipur, Chandigarh and more. 1800+ projects completed across India."
      }
    }
  ]
});

// BreadcrumbList schema — homepage is the root of the trail, so it's a
// single-item list (just "Home", no "item" URL — per Google's guidance,
// the current/last page in a trail doesn't need its own URL).
const breadcrumbSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home"
    }
  ]
});

// ✅ Task 1 fix — real H1, rendered in the actual DOM (not noscript-only)
// Visually hidden via .sr-only so it doesn't fight the hero slider's own
// marketing copy, but it's real text in the rendered HTML that Googlebot
// (and every other crawler) sees after JS runs.
//
// ✅ Task 2 fix — the old <noscript> block that duplicated this exact H1
// and copy has been removed entirely below. This component is now the
// single source of the homepage H1, so the page has exactly one H1 in
// both raw and rendered HTML.
function HomeIntro() {
  return (
    <section className="home-intro sr-only">
      <h1>Metaguise — India's Leading Metal Facade Company</h1>
      <p>
        Metaguise is India's premier metal facade specialist based in Gurugram, Haryana.
        We design and install luxury parametric metal facades, architectural cladding,
        and custom metal elevations for residential and commercial buildings across India.
        1800+ projects delivered pan-India since 2019.
      </p>
    </section>
  );
}

function Home() {
  return (
    <div className='Home'>
      <Helmet>
        <title>Metal Facade Company India | Parametric Cladding & Elevations | Metaguise</title>

        <meta name="description" content="Metaguise designs and installs metal facades, parametric cladding and aluminium elevations across India. 1800+ projects completed. Get a free facade consultation today." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://metaguise.com/" />
        <link rel="icon" href="https://metaguise.com/favicon.ico" />
                <meta name="keywords" content="metal facade India, aluminium cladding, parametric facade, facade cladding company India, Metaguise" />

        {/* Open Graph */}
        <meta property="og:title" content="Metal Facade Company India | Parametric Cladding & Elevations | Metaguise" />
        <meta property="og:description" content="Metaguise designs and installs metal facades, parametric cladding and aluminium elevations across India. 1800+ projects completed. Get a free facade consultation today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metaguise.com/" />
        <meta property="og:site_name" content="Metaguise" />
        <meta property="og:image" content="https://ik.imagekit.io/ylx9qggcp/1.webp" />
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

        {/* JSON-LD: FAQ */}
        <script type="application/ld+json">{faqSchema}</script>

        {/* JSON-LD: Speakable WebPage */}
        <script type="application/ld+json">{speakableSchema}</script>

        {/* JSON-LD: BreadcrumbList */}
        <script type="application/ld+json">{breadcrumbSchema}</script>
      </Helmet>

      {/* ✅ Task 1 — real H1, rendered in the DOM */}
      <HomeIntro />

      <Swipper />

      <Featured />

      <MetaExperience1 />
      <Product />

      <Metaland />
      <Brochure />
      <Cofee />

      <Footer />

      {/* FloatingButton is icon-only (no text), so it's the only
          piece still safe to lazy-load without affecting the
          rendered word count. */}
      <Suspense fallback={null}>
        <FloatingButton />
      </Suspense>
    </div>
  );
}

export default Home;