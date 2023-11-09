import React from "react";
import Header from "@/components/Header/Header.js";
import AlertBanner from "@/components/AlertBanner/AlertBanner";

export default function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <AlertBanner
        message={"PaperTrade Available NOW in the Investant Discord Server!"}
        link={"https://discord.gg/SFUKKjWEjH"}
        linkMessage={" Click here to join!"}
      />
      <Header/>
      {children}
    </div>
  );
}