import { STRAPIurl } from '@/my_modules/bloghelp';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from "next/head";
import Image from "next/image";
import DefaultLayout from "@/layouts/DefaultLayout";

export async function getServerSideProps(context) {
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetBlogPosts {
          latestSixPosts: blogPosts(pagination: { pageSize: 6 } sort: "id:desc") {
            data {
              id
              attributes {
                Title
                BlogPostDescription
                SLUG
                SPLASH {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
}

export default function Home(props) {

  // Arrange blog post data and variables
  const latestSixPosts = props.data.latestSixPosts.data; // The rest of the blog posts with the mostRecentPost removed

  // Handle the hovering of blog cards in the featured blog posts section
  const [openCardIndex, setOpenCardIndex] = useState(0);
  const handleCardHover = (index) => {setOpenCardIndex(index);}

  // Handle the click of the "Get Started" button in the hero section
  const getStartedButton = useRef(null);
  const paperTradeSection = useRef(null);
  useEffect(() => {
    const handleGetStartedButtonClick = () => {paperTradeSection.current.scrollIntoView({ behavior: 'smooth' });}
    const getStartedButtonReference = getStartedButton.current;

    if (getStartedButtonReference) {getStartedButtonReference.addEventListener('click', handleGetStartedButtonClick);}

    return () => {
      if (getStartedButtonReference) {getStartedButtonReference.removeEventListener('click', handleGetStartedButtonClick);}
    }
  }, []);

  return (
    <>
      <Head>
        <title>Investant | Financial Tools, Literacy, & Education</title>
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
        <main className="homepage">

          <section id="homepage-hero-section" className="homepage-hero-section">
            <div className="homepage-hero-section-text-container">
              <div className="homepage-hero-section-large-slogan">
                <h1>
                  Personal Finance
                  <br/>
                  <span className="homepage-hero-section-text-span">Made Simple.</span>
                </h1>
              </div>
              <div className="homepage-hero-section-investant-description">
                <p>{"Investant.net is your go-to resource for personal finance tools and information. We understand the unique challenges faced by new professionals starting their careers, and we're here to help you navigate your financial journey with confidence."}</p>
              </div>
              <div className="homepage-hero-section-button-container">
                <div ref={getStartedButton} id="homepage-hero-section-get-started-button" className="homepage-hero-section-get-started-button">
                  <h4>Get Started</h4>
                </div>
                <div className="homepage-hero-section-learn-more-button">
                  <Link href="/about-us"><h4>Learn More</h4></Link>
                </div>
              </div>
            </div>
            <div className="homepage-hero-section-image-container">
              <Image
                src={"/images/clipart/ClipArtOfficeWorker.svg"}
                alt="Office Worker ClipArt"
                priority={true}
                fill
              />
            </div>
          </section>

          <section ref={paperTradeSection} id="homepage-papertrade-section" className="homepage-papertrade-section">
            <div className="homepage-papertrade-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_glowing_cube_stock_photo_b4a91fa6e0"}
                alt="PaperTrade on investant.net"
                width={1200}
                height={600}
              />
            </div>
            <div className="homepage-papertrade-section-text-container">
              <div className="homepage-papertrade-section-title">
                <h2>
                  Discover the Power of PaperTrade on investant.net
                  <br></br>
                  <span className="homepage-papertrade-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="homepage-papertrade-section-subtitle">
                <p>Experience the thrill of trading without risking real money. Our PaperTrade platform allows you to practice and learn before you invest.</p>
              </div>
              <div className="homepage-papertrade-section-subtext-container">
                <div className="homepage-papertrade-section-subtext-element">
                  <div className="homepage-papertrade-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/papertrade-practice-icon.png"}
                      alt="Learn with PaperTrade on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="homepage-papertrade-section-subtext-element-text-container">
                    <h4>Practice</h4>
                    <p>Trade with virtual money and gain confidence in your investment skills</p>
                  </div>
                </div>
                <div className="homepage-papertrade-section-subtext-element">
                  <div className="homepage-papertrade-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/papertrade-learn-icon.png"}
                      alt="Learn with PaperTrade on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="homepage-papertrade-section-subtext-element-text-container">
                    <h4>Learn</h4>
                    <p>Access educational resources and expand your knowledge of the financial markets</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="homepage-financial-planner-section" className="homepage-financial-planner-section">
            <div className="homepage-financial-planner-section-text-container">
              <div className="homepage-financial-planner-section-title">
                <h2>
                  Simplify Your Finances with Our Easy-to-Use Planner
                  <br></br>
                  <span className="homepage-financial-planner-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="homepage-financial-planner-section-subtitle">
                <p>Our simple financial planner is designed to help you manage your personal finances more effectively. With an intuitive interface and powerful features, you can easily track your expenses, set budgets, and plan for the future.</p>
              </div>
              <div className="homepage-financial-planner-section-subtext-container">
                <div className="homepage-financial-planner-section-subtext-element">
                  <div className="homepage-financial-planner-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/investant-calculator-expenses-icon.png"}
                      alt="Track your expenses on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="homepage-financial-planner-section-subtext-element-text-container">
                    <h4>Track Expenses</h4>
                    <p>Effortlessly monitor your spending habits and gain better control over your finances</p>
                  </div>
                </div>
                <div className="homepage-financial-planner-section-subtext-element">
                  <div className="homepage-financial-planner-section-subtext-element-image-container">
                    <Image
                      src={"/images/icons/investant-budget-icon.png"}
                      alt="Set your budget on investant.net"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="homepage-financial-planner-section-subtext-element-text-container">
                    <h4>Set Budgets</h4>
                    <p>Create personalized budgets that align with your financial goals and priorities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="homepage-financial-planner-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_financial_planners_theme_stock_photo_57ff6eaffb"}
                alt="Personal Financial Planner on investant.net"
                width={1200}
                height={600}
              />
            </div>
          </section>

          <section id="homepage-featured-blog-posts-section" className="homepage-featured-blog-posts-section">
            <div className="homepage-featured-blog-posts-title-container">
              <div className="homepage-featured-blog-posts-title">
                <h1>Unlocking Financial Success Together</h1>
              </div>
              <div className="homepage-featured-blog-posts-subtitle">
                <p>Stay informed with our latest blog posts.</p>
              </div>
            </div>
            <div className="homepage-blog-post-cards-wrapper">
              <div className="homepage-blog-post-cards-container">
                {latestSixPosts.map((post, index) => (
                  <Link
                    href={`/blog/${post.attributes.SLUG}`}
                    key={post.id}
                    className={`homepage-blog-post-card ${openCardIndex === index ? 'open' : ''}`}
                    style={{ backgroundImage: `url(${post.attributes.SPLASH.data.attributes.url})` }}
                    onMouseEnter={() => handleCardHover(index)}
                  >
                    <div className="homepage-blog-post-card-row">
                      <div className="homepage-blog-post-card-description">
                        <h4>{post.attributes.Title}</h4>
                        <p>{post.attributes.BlogPostDescription}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="homepage-featured-blog-posts-blogpage-button">
              <Link href="/blog"><h4>View all</h4></Link>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}