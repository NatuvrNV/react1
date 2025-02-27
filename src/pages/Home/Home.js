import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing Components

//import MainContent from '../../components/MainContent';

import Footer from '../../components/Footer';
import FloatingButton from "../../components/Floatingbutton";
//import Metavision from '../../components/Metavision';
import Cofee from '../../components/Cofee';
//import Features from '../../components/Features';
import Product from '../../components/Product';
import Brochure from '../../components/Brochure';
// import Team from '../../components/Team';
import Metaland from '../../components/Metaland';
import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';
// import Metavision1 from '../../components/Metavision1';
import MetaExperience1 from '../../components/MetaExperience1';
import { Helmet } from "react-helmet-async";

function Home() {
  return (

    
    <div className='Home'>



      {/* Page Components */}
      

<Helmet>
        <title>Metaguise | India’s Leading Experts in Luxury Metal Facades</title>
        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades" />
        <meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India.." />
        <meta property="og:image" content="%PUBLIC_URL%/favicon.png" />

        <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />

        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Swipper />
      {/* <MainContent /> */}

      <Featured />
      {/* <Features /> */}
      <FloatingButton />
      <MetaExperience1 />
      <Product />
      <Metaland />
      {/* <Metavision1 /> */}
      {/* <Metavision /> */}
      {/* <Team /> */}
      <Brochure />
      <Cofee />
      <Footer />
    </div>
  );
}

export default Home;
