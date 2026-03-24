import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

const AppWrapper = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// ✅ If React Snap pre-rendered HTML exists → hydrate it
// ✅ If not (normal browser visit) → render fresh
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, AppWrapper);
} else {
  ReactDOM.createRoot(rootElement).render(AppWrapper);
}

reportWebVitals();