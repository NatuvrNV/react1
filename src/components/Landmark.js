import React from "react";
import "./Landmark.css"; // Custom CSS for the layout

const Landmark = () => {
  return (
    <div className="container-lankmark p-0">
      {/* Main Section */}
      <main className="main-section d-flex flex-column justify-content-center align-items-center text-center">
        <div className="text-container">
          <h1 className="headline">
            Transforming buildings <br></br>into iconic landmarks.
          </h1>
          <button className="hover-button">
            <span>See All Projects</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Landmark;
