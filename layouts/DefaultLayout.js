import React, { useState, useEffect } from "react";
import Header from "@/components/Header/Header.js";
import Footer from "@/components/Footer/Footer.js";
import AlertBanner from "@/components/AlertBanner/AlertBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function DefaultLayout({ children }) {
  const [showAlertBanner, setShowAlertBanner] = useState(false);

  // Check if user has alert banner closed in browser storage
  useEffect(() => {
    const isAlertBannerClosed = localStorage.getItem("investantNetAlertBannerClosed");
    if (!isAlertBannerClosed) {setShowAlertBanner(true);}
  }, []);

  // Events to trigger before terminating page session
  useEffect(() => {
    const handleBeforeUnload = () => {localStorage.removeItem("investantNetAlertBannerClosed");};
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {window.removeEventListener("beforeunload", handleBeforeUnload);};
  }, []);

  // Handle the closing of the alert banner with browser storage
  const handleCloseAlertBanner = () => {
    setShowAlertBanner(false);
    localStorage.setItem("investantNetAlertBannerClosed", "true");
  };

  return (
    <>
      <GoogleAnalytics/>

      <div className="default-layout">
        {(showAlertBanner === true) && (
          <AlertBanner
            message={"PaperTrade Available NOW in the Investant Discord Server!"}
            link={"https://discord.gg/SFUKKjWEjH"}
            linkMessage={"Click here to join!"}
            onClose={handleCloseAlertBanner}
          />
        )}
        <Header/>
        {children}
        <Footer/>
        <SpeedInsights/>
        <Analytics/>
      </div>
    </>
  );
}