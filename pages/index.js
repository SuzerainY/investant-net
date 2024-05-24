import { STRAPIurl, formatDate } from '@/my_modules/bloghelp';
import { useRef } from 'react';
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
          featuredPosts: blogPosts(pagination: { pageSize: 5 } sort: "id:desc") {
            data {
              id
              attributes {
                Title
                BlogPostDescription
                PublishDate
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

  // Arrange blog posts for display
  const featuredPosts = props.data.featuredPosts.data.slice(1);
  const featuredPost = props.data.featuredPosts.data.slice(0, 1)[0];

  // Document Sections by Reference
  const blogPostsSection = useRef(null);
  const paperTradeSection = useRef(null);
  const financialPlannerSection = useRef(null);
  const financialCalculatorSection = useRef(null);

  // Handle the click of the "Get Started" button in the hero section
  const getStartedButton = useRef(null);
  const handleGetStartedButtonClick = () => {blogPostsSection.current.scrollIntoView({ behavior: 'smooth' })};

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
                <button ref={getStartedButton} id="homepage-hero-section-get-started-button" className="homepage-hero-section-get-started-button" onClick={handleGetStartedButtonClick}>
                  <h4>Get Started</h4>
                </button>
                <Link href="/about-us" className="homepage-hero-section-learn-more-button">
                  <h4>Learn More</h4>
                </Link>
              </div>
            </div>
            <div className="homepage-hero-section-image-container">
              <Image
                src={"/images/clipart/ClipArtOfficeWorker.svg"}
                alt="Office Worker ClipArt"
                fill
              />
            </div>
          </section>

          <section ref={blogPostsSection} id="homepage-featured-blog-posts-section" className="homepage-featured-blog-posts-section">
            <div className="homepage-featured-blog-posts-section-title-container">
              <div className="homepage-featured-blog-posts-section-title">
                <h1>Unlocking Financial Success Together</h1>
              </div>
              <div className="homepage-featured-blog-posts-section-subtitle">
                <p>Stay informed with our latest blog posts</p>
              </div>
            </div>
            <div className="homepage-featured-blog-posts-section-posts-container">
              <div className="homepage-featured-blog-posts-section-top-post-container">
                <div className="homepage-featured-blog-posts-section-top-post-header-container">
                  <h3>Latest Story</h3>
                </div>
                <Link href={`/blog/${featuredPost.attributes.SLUG}`}>
                  <div className="homepage-featured-blog-posts-section-top-post-image-container">
                    <Image
                      src={featuredPost.attributes.SPLASH.data.attributes.url}
                      alt={featuredPost.attributes.BlogPostDescription}
                      width={800}
                      height={400}
                    />
                  </div>
                  <div className="homepage-featured-blog-posts-section-top-post-description-container">
                    <h3>{featuredPost.attributes.Title}</h3>
                    <p>{formatDate(new Date(featuredPost.attributes.PublishDate))}</p>
                  </div>
                </Link>
              </div>
              <div className="homepage-featured-blog-posts-section-other-posts-container">
                <div className="homepage-featured-blog-posts-section-other-posts-header-container">
                  <h3>More from <span className="homepage-featured-blog-posts-section-other-posts-header-span">investant.net</span></h3>
                </div>
                <div className="homepage-featured-blog-posts-section-other-posts-border-frame">
                  {featuredPosts.map((post, index) => (
                    <div key={index} className="homepage-featured-blog-posts-section-other-posts-row">
                      <div className="homepage-featured-blog-posts-section-other-posts-row-identifier">
                        <h4>{index + 1}</h4>
                      </div>
                      <div className="homepage-featured-blog-posts-section-other-posts-row-description">
                        <h3><Link href={`/blog/${post.attributes.SLUG}`}>{post.attributes.Title}</Link></h3>
                        <h4><Link href={`/blog/${post.attributes.SLUG}`}>{post.attributes.BlogPostDescription}</Link></h4>
                        <p>{formatDate(new Date(post.attributes.PublishDate))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="homepage-featured-blog-posts-section-blogpage-button">
              <Link href="/blog"><h4>View all</h4></Link>
            </button>
          </section>

          <section id="homepage-join-newsletter-section" className="homepage-join-newsletter-section">
            <div className="homepage-join-newsletter-section-text-container">
              <div className="homepage-join-newsletter-section-title">
                <h2><span className="homepage-join-newsletter-section-title-span">Subscribe</span> to our Newsletter</h2>
              </div>
            </div>
            <div className="homepage-join-newsletter-section-sign-up-container">
              <div className="homepage-join-newsletter-section-sign-up-input-container">
                <input type="email" placeholder="Email" className="homepage-join-newsletter-section-sign-up-email-box"></input>
                <button className="homepage-join-newsletter-section-sign-up-button">
                  <h4>Sign Up</h4>
                </button>
              </div>
              <div className="homepage-join-newsletter-section-sign-up-description">
                <p>Stay current with the latest personal finance news and updates</p>
              </div>
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

          <section ref={financialPlannerSection} id="homepage-financial-planner-section" className="homepage-financial-planner-section">
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
                    <p>Create personalized budgets that align with your financial goals and priorities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="homepage-financial-planner-section-image-container">
              <Image                
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_financial_planning_graphs_in_hand_stock_photo_305328e53e"}
                alt="Personal Financial Planner on investant.net"
                width={1200}
                height={600}
              />
            </div>
          </section>

          <section ref={financialCalculatorSection} id="homepage-financial-calculator-section" className="homepage-financial-calculator-section">
            <div className="homepage-financial-calculator-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/large_investant_financial_planners_theme_stock_photo_57ff6eaffb"}
                alt="PaperTrade on investant.net"
                width={1200}
                height={600}
              />
            </div>
            <div className="homepage-financial-calculator-section-text-container">
              <div className="homepage-financial-calculator-section-title">
                <h2>
                  Crystal Clear Finances: Introducing the investant.net Calculator
                  <br></br>
                  <span className="homepage-financial-calculator-section-title-span">{"[In Development]"}</span>
                </h2>
              </div>
              <div className="homepage-financial-calculator-section-subtitle">
                <p>Take charge of your financial future with the innovative investant.net calculator. Our calculator provides crystal clear insight into your financial trajectory, empowering you to make informed decisions today for a more secure tomorrow. Say goodbye to uncertainty and hello to precise financial planning with investant.net.</p>
              </div>
            </div>
          </section>

          <section id="homepage-create-new-account-section" className="homepage-create-new-account-section">
            <div className="homepage-create-new-account-section-text-container">
              <div className="homepage-create-new-account-section-title">
                <h2>Start Your Financial Journey Today</h2>
              </div>
              <div className="homepage-create-new-account-section-subtitle">
                <p>Get early access to PaperTrade, our exclusive newsletter, and all future products</p>
              </div>
            </div>
            <div className="homepage-create-new-account-section-buttons-container">
              <button className="homepage-create-new-account-section-sign-up-button">
                <h4>Sign Up</h4>
              </button>
              <Link href="/about-us" className="homepage-create-new-account-section-learn-more-button">
                <h4>Learn More</h4>
              </Link>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}