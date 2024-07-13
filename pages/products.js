import { useEffect, useRef, useState } from "react";
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import DefaultLayout from '@/layouts/DefaultLayout';

export default function Home() {

  /*
  const downloadInvestantConsciousPlannerURL = '/files/UserTemplates/Investant-ConsciousSpendingPlan.xlsx';
  const handleDownloadInvestantConsciousPlannerURL = () => {
    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.href = downloadInvestantConsciousPlannerURL;
    anchor.download = 'Investant-ConsciousSpendingPlan.xlsx';
    anchor.click();
  };
  */

  // References to each product section | used by <Header/> component to navigate user: components\Header\Header.js
  const paperTradeSection = useRef(null);
  const financialPlannerSection = useRef(null);
  const financialCalculatorSection = useRef(null);

  return (
    <>
      <Head>
        <title>Investant | Products</title>
        <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investant | Products" />
        <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

        {/* Open Graph Meta Tags (for platforms like Facebook) */}
        <meta property="og:title" content="Investant | Products" />
        <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
        <meta property="og:url" content="https://investant.net/products" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Investant" />

        {/* Favicon */}
        <link rel="icon" href="/images/branding/FaviconTransparent.png" />
      </Head>

      <DefaultLayout>
        <main className="productspage">

          <section className="productspage-title-section">
            <div className="productspage-title-section-text-container">
              <div className="productspage-title-section-title">
                <h1><span className="productspage-title-section-title-span">Investant</span> Products</h1>
              </div>
              <div className="productspage-title-section-subtitle">
                <p>Tools for <span className="productspage-title-section-subtitle-span">your</span> financial growth.</p>
              </div>
            </div>
          </section>

          <section ref={paperTradeSection} id="productspage-papertrade-section" className="productspage-papertrade-section">
            <div className="productspage-papertrade-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_glowing_cube_stock_photo_b4a91fa6e0"}
                alt="PaperTrade on investant.net"
                width={1200}
                height={600}
              />
            </div>
            <div className="productspage-papertrade-section-text-container">
              <div className="productspage-papertrade-section-title">
                <h2>
                  Discover the Power of PaperTrade on investant.net
                  <br></br>
                  <span className="productspage-papertrade-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="productspage-papertrade-section-subtitle">
                <p>Experience the thrill of trading without risking real money. Our PaperTrade platform allows you to practice and learn before you invest.</p>
              </div>
              <div className="productspage-papertrade-section-subtext-container">
                <div className="productspage-papertrade-section-subtext-element">
                  <div className="productspage-papertrade-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/papertrade-practice-icon.png"}
                      alt="Learn with PaperTrade on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="productspage-papertrade-section-subtext-element-text-container">
                    <h4>Practice</h4>
                    <p>Trade with virtual money and gain confidence in your investment skills</p>
                  </div>
                </div>
                <div className="productspage-papertrade-section-subtext-element">
                  <div className="productspage-papertrade-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/papertrade-learn-icon.png"}
                      alt="Learn with PaperTrade on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="productspage-papertrade-section-subtext-element-text-container">
                    <h4>Learn</h4>
                    <p>Access educational resources and expand your knowledge of the financial markets</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section ref={financialPlannerSection} id="productspage-financial-planner-section" className="productspage-financial-planner-section">
            <div className="productspage-financial-planner-section-text-container">
              <div className="productspage-financial-planner-section-title">
                <h2>
                  Simplify Your Finances with Our Easy-to-Use Planner
                  <br></br>
                  <span className="productspage-financial-planner-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="productspage-financial-planner-section-subtitle">
                <p>Our simple financial planner is designed to help you manage your personal finances more effectively. With an intuitive interface and powerful features, you can easily track your expenses, set budgets, and plan for the future.</p>
              </div>
              <div className="productspage-financial-planner-section-subtext-container">
                <div className="productspage-financial-planner-section-subtext-element">
                  <div className="productspage-financial-planner-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/investant-calculator-expenses-icon.png"}
                      alt="Track your expenses on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="productspage-financial-planner-section-subtext-element-text-container">
                    <h4>Track Expenses</h4>
                    <p>Effortlessly monitor your spending habits and gain better control over your finances</p>
                  </div>
                </div>
                <div className="productspage-financial-planner-section-subtext-element">
                  <div className="productspage-financial-planner-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/investant-budget-icon.png"}
                      alt="Set your budget on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="productspage-financial-planner-section-subtext-element-text-container">
                    <h4>Set Budgets</h4>
                    <p>Create personalized budgets that align with your financial goals and priorities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="productspage-financial-planner-section-image-container">
              <Image                
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_financial_planning_graphs_in_hand_stock_photo_305328e53e"}
                alt="Personal Financial Planner on investant.net"
                width={1200}
                height={600}
              />
            </div>
          </section>

          <section ref={financialCalculatorSection} id="productspage-financial-calculator-section" className="productspage-financial-calculator-section">
            <div className="productspage-financial-calculator-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_financial_planners_theme_stock_photo_57ff6eaffb"}
                alt="PaperTrade on investant.net"
                width={1200}
                height={600}
              />
            </div>
            <div className="productspage-financial-calculator-section-text-container">
              <div className="productspage-financial-calculator-section-title">
                <h2>
                  Crystal Clear Finances: Introducing the investant.net Calculator
                  <br></br>
                  <span className="productspage-financial-calculator-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="productspage-financial-calculator-section-subtitle">
                <p>Take charge of your financial future with the innovative investant.net calculator. Our calculator provides crystal clear insight into your financial trajectory, empowering you to make informed decisions today for a more secure tomorrow. Say goodbye to uncertainty and hello to precise financial planning with investant.net.</p>
              </div>
            </div>
          </section>

          <section id="productspage-create-new-account-section" className="productspage-create-new-account-section">
            <div className="productspage-create-new-account-section-text-container">
              <div className="productspage-create-new-account-section-title">
                <h2>Start Your Financial Journey Today</h2>
              </div>
              <div className="productspage-create-new-account-section-subtitle">
                <p>Get early access to PaperTrade, our exclusive newsletter, and all future products</p>
              </div>
            </div>
            <div className="productspage-create-new-account-section-buttons-container">
              <Link href="/login?&form=SignUp" className="productspage-create-new-account-section-sign-up-button">
                <h4>Sign Up</h4>
              </Link>
              <Link href="/about-us" className="productspage-create-new-account-section-learn-more-button">
                <h4>Learn More</h4>
              </Link>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}