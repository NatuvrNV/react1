import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

const AppWrapper = (
  // ✅ StrictMode hatao
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// ✅ Hamesha fresh render karo — hydrate mat karo
ReactDOM.createRoot(rootElement).render(AppWrapper);

reportWebVitals();