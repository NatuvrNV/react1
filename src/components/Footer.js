import React from "react";
import "./Footer.css";
import logo from "../assets/logo.png";
import MailIcon from "../assets/footer/mail.svg";
import PhoneIcon from "../assets/footer/phone.svg";


const Footer = () => {
  return (
    <footer className="tw-mt-14 tw-pb-8 tw-max-w-[1100px] tw-mx-auto tw-px-4">
    <div className="Desk-footer">
    <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-start md:tw-items-start tw-gap-8 md:tw-gap-32 font ">
        {/* Image 1 */}
       <div className="tw-flex tw-items-center tw-gap-4">
  <img className="tw-w-32 md:tw-w-40" src={logo} alt="METAGUISE Logo" />

<a href=" https://www.architecturaldigest.in/adpro/directory/profile/metaguise/" style={{ display: "inline-block" }}>
  <img
    className="tw-w-[100px]"
    src="https://ik.imagekit.io/ylx9qggcp/ADprocolor%20(2).png"
    alt="ADpro Logo"
    style={{ cursor: "pointer" }}
  />
</a>

</div>

        <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center md:tw-items-start tw-gap-8 md:tw-gap-32">
          {/* Home Links */}
          <div className="tw-text-base tw-flex tw-flex-col tw-items-center md:tw-items-start tw-text-center md:tw-text-right footer-links ">
            <a href="/">Home</a>
            <a href="/all-projects">Projects</a>
            <a href="/all-products">Products</a>
          </div>
          {/* About Links */}
          <div className="tw-text-base tw-flex tw-flex-col tw-items-center md:tw-items-start footer-links col-xl-3">
            <a href="/about">About Us</a>
            <a href="/contact">Talk to Us</a>
            <a href="/partner">Partner With Us</a>
          </div>
          {/* Contact Links */}
          <div className="tw-flex tw-text-base tw-flex-col tw-items-center md:tw-items-start tw-gap-4 footer-links col-lg-10 col-xl-6">
            <div className="tw-flex tw-items-center tw-gap-2">
              <img src={PhoneIcon} alt="mail" />
              <a
                href="mailto:contactus@metaguise.com"
                className="tw-text-sm md:tw-text-base"
              >
                contactus@metaguise.com
              </a>
            </div>

            <div className="tw-flex tw-gap-4">
              <img src={MailIcon} alt="phone" />
              <a
                href="tel:981-160-4449"
                className="tw-text-sm md:tw-text-base"
              >
                981-160-4449 
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* {Mobile Version Footer} */}

    <div className="Mob-footer">
 

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center md:tw-items-start tw-gap-8 md:tw-gap-32 font  ">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center md:tw-items-start tw-gap-8 md:tw-gap-32 section-1 ">
       
        <img id="footer-logo" className="tw-w-32 md:tw-w-40 " src={logo} alt="METAGUISE Logo" />
      <img id="footer-logo" className="tw-w-32 md:tw-w-40 " src="https://ik.imagekit.io/ylx9qggcp/ADprocolor%20(2).png" alt="METAGUISE Logo" />
   {/* Contact Links */}
   <div className="tw-flex tw-text-base tw-flex-col tw-items-center md:tw-items-start tw-gap-4 footer-links col-lg-10 col-xl-6">
            <div className="tw-flex tw-items-center tw-gap-2">
              <img src={PhoneIcon} alt="mail" />
              <a
                href="mailto:contactus@metaguise.com"
                className="tw-text-sm md:tw-text-base"
              >
                contactus@metaguise.com
              </a>
            </div>

            <div className="tw-flex tw-gap-4">
              <img src={MailIcon} alt="phone" />
              <a
                href="tel:981-160-4449"
                className="tw-text-sm md:tw-text-base"
              >
                981-160-4449 
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center md:tw-items-start tw-gap-8 md:tw-gap-32 font  ">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center md:tw-items-start tw-gap-8 md:tw-gap-32 section-2 ">
          {/* Home Links */}
          <div className="tw-text-base tw-flex tw-flex-col tw-items-center md:tw-items-start tw-text-center md:tw-text-right footer-links ">
            <a href="/">Home</a>
            <a href="/all-projects">Projects</a>
            
          </div>
          {/* About Links */}
          <div className="tw-text-base tw-flex tw-flex-col tw-items-center md:tw-items-start footer-links col-xl-3">
          <a href="/all-products">Products</a>
            <a href="/about">About Us</a>
            
          </div>

            {/* About Links */}
            <div className="tw-text-base tw-flex tw-flex-col tw-items-center md:tw-items-start footer-links col-xl-3">
            
            <a href="/contact">Talk to Us</a>
            <a href="/partner">Partner With Us</a>
          </div>
       
        </div>
      </div>
    </div>
    </footer>

    
  );
};

export default Footer;
