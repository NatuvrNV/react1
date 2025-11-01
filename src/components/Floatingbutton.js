import React from "react";
import WhatsAppIcon from "../assets/footer/Whatsapp.svg"; // ✅ Make sure this path is correct

const FloatingButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/message/KEUH3LADTELUP1", "_blank");
  };

  return (
    <>
      <div className="floating-button" onClick={handleClick}>
        <img src={WhatsAppIcon} alt="WhatsApp" className="floating-icon" />
      </div>

      <style>
        {`
          .floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #25D366; /* WhatsApp green */
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
            z-index: 99999;
            animation: pulse 2s infinite;
          }

          .floating-button:hover {
            background-color: #1ebe5d;
            transform: scale(1.1);
          }

          .floating-icon {
            width: 30px;
            height: 30px;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
          }
        `}
      </style>
    </>
  );
};

export default FloatingButton;
