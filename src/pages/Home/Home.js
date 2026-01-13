import React, { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet-async";

// 1. Critical Components: Load these normally (immediately)
import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';

// 2. Non-Critical Components: Lazy load these (splits the 584KB bundle)
const MetaExperience1 = lazy(() => import('../../components/MetaExperience1'));
const Product = lazy(() => import('../../components/Product'));
const Metaland = lazy(() => import('../../components/Metaland'));
const Brochure = lazy(() => import('../../components/Brochure'));
const Cofee = lazy(() => import('../../components/Cofee'));
const Footer = lazy(() => import('../../components/Footer'));
const FloatingButton = lazy(() => import("../../components/Floatingbutton"));

function Home() {
  return (
    <div className='Home'>
      <Helmet>
        <title>Metaguise | India’s Leading Experts in Luxury Metal Facades</title>
        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades..." />
        <link rel="canonical" href="https://metaguise.com/" />
      </Helmet>

      {/* Load immediately - Above the fold */}
      <Swipper />
      <Featured />

      {/* 3. Wrap everything else in Suspense to prevent blocking */}
      <Suspense fallback={<div style={{ height: '200px' }}>Loading...</div>}>
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