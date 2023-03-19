import React from "react";
import Header from "@/components/Header/Header.js";
import Image from "next/image";
function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <Header />
      {children}
    </div>
  );
}

export default DefaultLayout;
