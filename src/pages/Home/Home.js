import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet-async";


// Importing Components
import Footer from '../../components/Footer';
import Cofee from '../../components/Cofee';
import Product from '../../components/Product';
import Brochure from '../../components/Brochure';
import Metaland from '../../components/Metaland';
import { Swipper } from '../../components/Swiper'; // Use 'Swipper' instead of 'Swiper'
import Featured from '../../components/Featured';
import MetaExperience1 from '../../components/MetaExperience1';

function Home() {
  return (
    <div className='Home'>
   


      {/* Page Components */}
      <Swipper />  {/* Fixed import */}
<Helmet>
        <title>Metaguise | India’s Leading Experts in Luxury Metal Facades</title>
        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades" />
        <meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India.." />
        <meta property="og:image" content="%PUBLIC_URL%/favicon.png" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Swipper />
      {/* <MainContent /> */}

      <Featured />
      <MetaExperience1 />
      <Product />
      <Metaland />
      <Brochure />
      <Cofee />
      <Footer />
    </div>
  );
}

export default Home;
