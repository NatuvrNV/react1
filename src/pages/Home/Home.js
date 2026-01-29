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
        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades" />
        <meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:image" content="https://metaguise.com/home-image.jpg" />
        <link rel="icon" type="image/png" href="https://metaguise.com/favicon.ico" />
        <link rel="canonical" href="https://metaguise.com/" /> 
        <meta name="robots" content="index, follow" />
 

        
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