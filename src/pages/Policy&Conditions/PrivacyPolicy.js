import React from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../../components/Footer";



function PrivacyPolicy() {
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
        <div className="container privacy-text">
      <h1 className="text-3xl font-semibold my-4">Privacy Policy</h1>
      <p><strong>Who we are</strong></p>
      <p>Our website address is: <a href="http://www.metaguise.com/" target="_blank" rel="noopener noreferrer">www.metaguise.com</a></p>

      <h2 className="text-2xl font-semibold mt-4">Terms</h2>
      <p>
        By accessing this website, you agree to be bound by these website Terms and Conditions of Use, applicable laws, and their compliance.
        If you disagree with any of the stated terms and conditions, you are prohibited from using or accessing this site. 
        The materials contained in this site are protected by relevant copyright and trademark law.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Use License</h2>
      <p>
        Permission is allowed to temporarily download one duplicate of the materials (data or programming) on Metaguise site for 
        individual and non-business use only. This is just a permit of license and not an exchange of title, and under this permit, you may not:
      </p>
      <ul className="list-disc ml-6">
        <li>Modify or copy the materials;</li>
        <li>Use the materials for any commercial use, or for any public presentation (business or non-business);</li>
        <li>Attempt to decompile or rebuild any product or material contained on Metaguise site;</li>
        <li>Remove any copyright or other restrictive notations from the materials; or</li>
        <li>Transfer the materials to someone else or even “mirror” the materials on another server.</li>
      </ul>
      <p>
        This permit might be terminated if you disregard any of these confinements and may be ended by Metaguise whenever deemed.
        After permit termination or when your viewing permit is terminated, you must destroy any downloaded materials in your possession 
        whether in electronic or printed form.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Disclaimer</h2>
      <p>
        The materials on Metaguise site are given “as is.” Metaguise makes no guarantees, expressed or implied, 
        and thus disclaims and negates all other warranties, including without limitation implied warranties or conditions of 
        merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. 
      </p>

      <h2 className="text-2xl font-semibold mt-4">Constraints</h2>
      <p>
        In no event shall Metaguise or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
        or profit, or due to business interruption) arising out of the use or inability to use the materials on Metaguise Internet site, 
        even if Metaguise or an authorized representative has been notified orally or in writing of the possibility of such damage.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Amendments and Errata</h2>
      <p>
        The materials appearing on Metaguise site could include technical, typographical, or photographic errors.
        Metaguise does not warrant that any of the materials on its site are accurate, complete, or current.
        Metaguise may make changes to the materials contained on its site at any time without notice.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Links</h2>
      <p>
        Metaguise has not reviewed all of the websites or links connected to its website and is not responsible for the contents of 
        any such linked site. The inclusion of any link does not imply endorsement by Metaguise of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Site Terms of Use Modifications</h2>
      <p>
        Metaguise may revise these terms of use for its website at any time without notice. By using this site, 
        you are agreeing to be bound by the then-current version of these Terms and Conditions of Use.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Governing Law</h2>
      <p>
        Any claim relating to Metaguise site shall be governed by the laws of India without regard to its conflict of law provisions.
      </p>

      <h2 className="text-2xl font-semibold mt-4">General Terms and Privacy Policy</h2>
      <p>Your privacy is critical to us. Likewise, we have built up this Policy with the end goal you should see how we:</p>
      <ul className="list-disc ml-6">
        <li>Identify the purposes for which information is being collected.</li>
        <li>Gather and use personal data solely for fulfilling those purposes specified by us.</li>
        <li>Retain personal data only as long as necessary for fulfillment of those purposes.</li>
        <li>Collect personal data by legal and fair means with the individual's consent.</li>
        <li>Ensure personal data is accurate, complete, and up-to-date.</li>
        <li>Protect personal data against unauthorized access, disclosure, or loss.</li>
        <li>Provide customers access to policies and procedures for managing personal data.</li>
      </ul>
      <p className="mt-4">We are committed to conducting our business to ensure that the privacy of personal data is secure and maintained.</p>
    </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
