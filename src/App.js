import React from 'react';

import './App.css';
import NotFound from "./components/Notfound";
import { HelmetProvider } from "react-helmet-async";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import SingleProduct from './pages/SingleProduct/SingleProduct';
import SingleProject from './pages/SingleProject/SingleProject';
import Allproducts from './pages/AllProduct/Allproducts';
import Allprojects from './pages/AllProject/Allprojects';
import Blogs from './pages/Blog/Blog';
import SingleBlogPage from './pages/Blog/SingleBlog';
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
import PrivacyPolicy from './pages/Policy&Conditions/PrivacyPolicy';
import Terms from './pages/Policy&Conditions/TermsConditions';
import Preloader from './components/Preloader';
import Login from "./pages/BackendAdmin/Login";
import Admin from "./pages/BackendAdmin/Admin";
import Build from './pages/Build Your Facade/build.js';
import TWoApp from './configurator-app/TwoStepConfigurator.js';
import ProductApp from './configurator-app/ProductConfigurator.js';



function App() {

  return (

    <HelmetProvider>
          <Preloader >
  </Preloader>
    <Router>
      <Layout>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/all-products" element={<Allproducts />} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/all-projects" element={<Allprojects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/metaform" element={<MetaForm />} />
          <Route path="/ctb" element={<CTB />} />
          <Route path="/metafunction" element={<MetaFunction />} />
  <Route path="/build" element={<Build />} />
          <Route path="/metaparametric" element={<MetaParametric />} />
          <Route path="/metasurface" element={<MetaSurface />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/all-products/:productName" element={<SingleProduct />} />
          <Route path="/all-projects/:projectName" element={<SingleProject />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/metavision" element={<Metavision />} />
          <Route path="/metaexperience" element={<MetaExperience />} />
          <Route path="/blog/:title" element={<SingleBlogPage />} />
     <Route path="/app2" element={<ProductApp />} />
          <Route path="/twostep" element={<TWoApp />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
    </HelmetProvider>
  );
}

export default App;
