import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../components/Footer';
import Cofee from '../../components/Cofee';
import Product from '../../components/Product';
import Brochure from '../../components/Brochure';
import Metaland from '../../components/Metaland';
import { Swipper } from '../../components/Swiper';
import Featured from '../../components/Featured';
import MetaExperience1 from '../../components/MetaExperience1';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import MailIcon from "../../assets/footer/phone.svg";

function Home() {
  const navigate = useNavigate(); 

  return (
    <div className='Home'>
      <Helmet>
        <title>Metaguise | India’s Leading Experts in Luxury Metal Facades</title>
        <meta name="description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:title" content="Metaguise | India’s Leading Experts in Luxury Metal Facades" />
        <meta property="og:description" content="Metaguise specializes in bespoke luxury metal facades, parametric designs, and architectural cladding, redefining modern elevations in India." />
        <meta property="og:image" content="https://yourwebsite.com/home-image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Swipper />
      <Featured />
      <MetaExperience1 />
      <Product />
      <Metaland />
      <Brochure />
      <Cofee />
      <Footer />

      {/* Floating Contact Button */}
      <div 
        className="floating-button"
        onClick={() => navigate('/contact')}
      >
        <img src={MailIcon} alt="mail" />
      </div>

      {/* Styles for the button */}
      <style>
        {`
          .floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #000;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }
          .floating-button:hover {
            background-color: #000;
          }
          .icon {
            font-size: 24px;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
