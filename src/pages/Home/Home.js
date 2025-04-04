import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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

<Helmet>
        <title>Metaguise | Leading experts in Metal Facades & Parametric Architecture </title>
        <meta name="description" content="Specializing in bespoke metal cladding solutions & parametric architecture, redefining modern facade design." />
        <meta property="og:title" content="Metaguise | Leading experts in Metal Facades & Parametric Architecture " />
        <meta property="og:description" content="Specializing in bespoke metal cladding solutions & parametric architecture, redefining modern facade design.." />
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
