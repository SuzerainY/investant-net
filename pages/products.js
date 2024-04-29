import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function Home() {

  const [downloadInvestantConsciousPlannerURL, setDownloadInvestantConsciousPlannerURL] = useState('/files/UserTemplates/Investant-ConsciousSpendingPlan.xlsx');
  const handleDownloadInvestantConsciousPlannerURL = () => {
    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.href = downloadInvestantConsciousPlannerURL;
    anchor.download = 'Investant-ConsciousSpendingPlan.xlsx';
    anchor.click();
  };

  return (
    <>
      <Head>
        <title>Investant | Our Products</title>
        <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investant | Financial Tools, Literacy, & Education" />
        <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

        {/* Open Graph Meta Tags (for platforms like Facebook) */}
        <meta property="og:title" content="Investant | Financial Tools, Literacy, & Education" />
        <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
        <meta property="og:url" content="https://investant.net" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Investant" />

        {/* Favicon */}
        <link rel="icon" href="/images/branding/FaviconTransparent.png" />
      </Head>

      <DefaultLayout>
        <main className="productspage">
          <section className="productspage-title-section">
            <div className="productspage-title-container">
              <h1>Our <span className="productspage-title-span">Products |</span></h1>
              <h3>Inspiring Innovative Minds</h3>
            </div>
          </section>
          <section className="productspage-info-section">
            <div className="productspage-info-description">
              <h4><span className="productspage-info-description-span">investant.net</span> is committed to the development and deployment of tools and resources for <span className="productspage-info-description-span">your</span> financial future.</h4>
            </div>
          </section>
          <div className="productspage-divider-1">
            <div className="productspage-divider-1-color-1"></div>
            <div className="productspage-divider-1-color-2"></div>
          </div>
          <section className="productspage-conscious-planner-section">
            <div className="productspage-conscious-planner-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/v1714367219/Investant_Conscious_Spending_Planner_4177114c28.png"}
                alt={"Investant Conscious Spending Planner"}
                priority={true}
                width={600}
                height={300}
              />
            </div>
            <div className="productspage-conscious-planner-description">
              <h4><span className="productspage-conscious-planner-description-span">Personal Finance should be simple.</span> Gain financial clarity with our conscious planner, offering a clear overview of your budget to kickstart your financial journey.</h4>
              <div onClick={handleDownloadInvestantConsciousPlannerURL} className="productspage-conscious-planner-download-button">
                <h4>DOWNLOAD</h4>
              </div>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}