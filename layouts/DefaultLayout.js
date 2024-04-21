import React, { useState, useEffect } from "react";
import Header from "@/components/Header/Header.js";
import Footer from "@/components/Footer/Footer.js";
import AlertBanner from "@/components/AlertBanner/AlertBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function DefaultLayout({ children }) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const isAlertBannerClosed = localStorage.getItem("investantNetAlertBannerClosed");
    if (!isAlertBannerClosed) {
      setShowAlert(true);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("investantNetAlertBannerClosed");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleCloseAlertBanner = () => {
    setShowAlert(false);
    localStorage.setItem("investantNetAlertBannerClosed", "true");
  };

  return (
    <div className="default-layout">
      {(showAlert === true) && (
        <AlertBanner
          message={"PaperTrade Available NOW in the Investant Discord Server! "}
          link={"https://discord.gg/SFUKKjWEjH"}
          linkMessage={"Click here to join!"}
          onClose={handleCloseAlertBanner} // Passing in the close alert banner handler
        />
      )}
      <Header/>
      {children}
      <Footer/>
      <SpeedInsights/>
      <Analytics/>
    </div>
  );
}