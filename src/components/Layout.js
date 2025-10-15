import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide header on login and admin pages
  const hideHeader = location.pathname === "/login" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/projects") || location.pathname.startsWith("/products")|| location.pathname.startsWith("/app") || location.pathname.startsWith("/products")|| location.pathname.startsWith("/twostep");

  return (
    <div>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
