import React from "react";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../../components/Footer";



function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  // useEffect(() => {
  //   AOS.init({
  //     duration: 2000, // Animation duration
  //   });
  // }, []);

  return (
    
    <div className="container-fluid ">

      <div className="content-desk">
        {/* <main> */}
        <div className="container-fluid my-5">
        <div className="container mx-auto p-6 privacy-text">
      <h1 className="text-3xl font-semibold my-4">Terms and Conditions</h1>
      <p>Welcome to Metaguise!</p>
      <p>
        These terms and conditions outline the rules and regulations for the use
        of Metaguise’s Website, located at https://www.metaguise.com/.
      </p>
      <p>
        By accessing this website we assume you accept these terms and
        conditions. Do not continue to use Metaguise if you do not agree to take
        all of the terms and conditions stated on this page.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Cookies</h2>
      <p>
        We employ the use of cookies. By accessing Metaguise, you agreed to use
        cookies in agreement with Metaguise’s Privacy Policy.
      </p>
      <h2 className="text-2xl font-semibold mt-4">License</h2>
      <p>
        Unless otherwise stated, Metaguise and/or its licensors own the
        intellectual property rights for all material on Metaguise. All
        intellectual property rights are reserved. You may access this from
        Metaguise for your own personal use, subject to restrictions set in
        these terms and conditions.
      </p>
      <ul className="list-disc ml-6">
        <li>Republish material from Metaguise</li>
        <li>Sell, rent, or sub-license material from Metaguise</li>
        <li>Reproduce, duplicate, or copy material from Metaguise</li>
        <li>Redistribute content from Metaguise</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-4">Disclaimer</h2>
      <p>
        To the maximum extent permitted by applicable law, we exclude all
        representations, warranties, and conditions relating to our website and
        the use of this website. Nothing in this disclaimer will:
      </p>
      <ul className="list-disc ml-6">
        <li>Limit or exclude our or your liability for death or personal injury</li>
        <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li>
        <li>
          Limit any of our or your liabilities in any way that is not permitted
          under applicable law
        </li>
      </ul>
      <p className="mt-4">
        As long as the website and the information and services on the website
        are provided free of charge, we will not be liable for any loss or
        damage of any nature.
      </p>
    </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;
