import React from "react";
import Header from "@/components/Header/Header.js";

export default function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <Header/>
      {children}
    </div>
  );
}
