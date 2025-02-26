import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


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
