import AlertBanner from "@/components/AlertBanner/AlertBanner";
import Header from "@/components/Header/Header.js";
import Footer from "@/components/Footer/Footer.js";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function DefaultLayout({ children }) {
  return (
    <>
      <GoogleAnalytics/>
      <div className="default-layout">
        <AlertBanner/>
        <Header/>
        {children}
        <Footer/>
        <SpeedInsights/>
        <Analytics/>
      </div>
    </>
  );
};