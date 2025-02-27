import React from "react";
import { useNavigate } from "react-router-dom";
import MailIcon from "../assets/footer/phone.svg"; // Ensure correct path

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="floating-button" onClick={() => navigate("/contact")}>
        <img src={MailIcon} alt="Contact Us" className="floating-icon" />
      </div>

      <style>
        {`
          .floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #000;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
            z-index:99999;
          }

          .floating-button:hover {
            background-color: #222;
            transform: scale(1.1);
          }

          .floating-icon {
            width: 30px;
            height: 30px;
          }
        `}
      </style>
    </>
  );
};

export default FloatingButton;
