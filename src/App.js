import React from 'react';

import './App.css';
import { HelmetProvider } from "react-helmet-async";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import SingleProduct from './pages/SingleProduct/SingleProduct';
import SingleProject from './pages/SingleProject/SingleProject';
import Allproducts from './pages/AllProduct/Allproducts';
import Allprojects from './pages/AllProject/Allprojects';
import Contact from './pages/Contact/Contact';
import MetaForm from './pages/Contact/metafrom1';
import MetaFunction from './pages/Contact/metafrom2';
import MetaParametric from './pages/Contact/metafrom3';
import MetaSurface from './pages/Contact/metafrom4';
import { About } from './pages/About/About';
import Metavision from './components/Metavision';
import MetaExperience from './components/MetaExperience';
import Partner from './pages/Partner/Partner';
import CTB from './pages/Contact/coffeform';


function App() {
  return (
    
    <HelmetProvider>
    <Router>
      <Layout>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/all-products" element={<Allproducts />} />
          <Route path="/all-projects" element={<Allprojects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/metaform" element={<MetaForm />} />
          <Route path="/ctb" element={<CTB />} />
          <Route path="/metafunction" element={<MetaFunction />} />
          <Route path="/metaparametric" element={<MetaParametric />} />
          <Route path="/metasurface" element={<MetaSurface />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/all-products/:productName" element={<SingleProduct />} />
          <Route path="/all-projects/:projectName" element={<SingleProject />} />
          <Route path="/about" element={<About />} />
          <Route path="/metavision" element={<Metavision />} />
          <Route path="/metaexperience" element={<MetaExperience />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
    </HelmetProvider>
  );
}

export default App;