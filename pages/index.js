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
};

export default function Home(props) {

  // Arrange blog posts for display
  const featuredPosts = props.data.featuredPosts.data.slice(1);
  const featuredPost = props.data.featuredPosts.data.slice(0, 1)[0];

  // Document Sections by Reference | used by <Header/> component to navigate user: components\Header\Header.js
  const investorRoadmapSection = useRef(null);
  const blogPostsSection = useRef(null);

  // Handle the click of the "Get Started" button in the hero section
  const getStartedButton = useRef(null);
  const handleGetStartedButtonClick = () => {investorRoadmapSection.current?.scrollIntoView({ behavior: 'smooth' })};

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
                  Start Your
                  <br/>
                  <span className="homepage-hero-section-text-span">Wealth-Building Journey</span>
                </h1>
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
                src={"/images/clipart/OfficeWorkerHeroComponents/Main_Piece_The_Guy.svg"}
                alt="Office Worker ClipArt"
                fill={true}
                placeholder="blur"
                blurDataURL={"/images/clipart/OfficeWorkerHeroComponents/Main_Piece_The_Guy.svg"}
              />
              <div className="homepage-hero-section-hero-piece-1">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_1_Paper.svg"}
                  alt="homepage hero section hero piece 1"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-2">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_2_White_Star.svg"}
                  alt="homepage hero section hero piece 2"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-3">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_3_Flower.svg"}
                  alt="homepage hero section hero piece 3"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-4">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_4_Green_Star.svg"}
                  alt="homepage hero section hero piece 4"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-5">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_5_Coins.svg"}
                  alt="homepage hero section hero piece 5"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-6">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_6_Person.svg"}
                  alt="homepage hero section hero piece 6"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-7">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_7_Pink_Star_1.svg"}
                  alt="homepage hero section hero piece 7"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-8">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_8_Pink_Star_2.svg"}
                  alt="homepage hero section hero piece 8"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-9">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_9_Blue_Star.svg"}
                  alt="homepage hero section hero piece 9"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-10">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_10_Yellow_Star.svg"}
                  alt="homepage hero section hero piece 10"
                  width={100}
                  height={100}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-11">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_11_Graph.svg"}
                  alt="homepage hero section hero piece 11"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </section>

          <section ref={investorRoadmapSection} id="homepage-investor-roadmap-section" className="homepage-investor-roadmap-section">
            <div className="homepage-investor-roadmap-section-title-container">
              <div className="homepage-investor-roadmap-section-title">
                <h1>The <span className="homepage-investor-roadmap-section-title-span">Investant</span> Handbook</h1>
              </div>
              <div className="homepage-investor-roadmap-section-subtitle">
                <p>3 Steps To Take Today</p>
              </div>
            </div>
            <div className="homepage-investor-roadmap-section-roadmap-container">
              <div className="homepage-investor-roadmap-section-roadmap-step">
                <div className="homepage-investor-roadmap-section-roadmap-step-commentary">
                  <h2 style={{fontWeight: 'bold', color: 'black'}}>Step 1: Get Started</h2>
                  <p><br/>This is the perfect time to start building your future! {`Let's`} find you an account to build wealth tax-deferred!</p>
                  <ul style={{listStyle: 'inside'}}><br/>
                    <li><span style={{fontWeight: 'bold'}}>Roth IRA</span>
                      <ul style={{marginLeft: '20px'}}>
                        <li>Pay taxes on money now, withdraw tax-free later</li>
                        <li>Tax-free capital gains</li>
                        <li>For those who expect to be in a higher tax bracket in the future</li>
                      </ul>
                    </li>
                    <br/>
                    <li><span style={{fontWeight: 'bold'}}>Traditional IRA</span>
                      <ul style={{marginLeft: '20px'}}>
                        <li>Pay taxes upon withdrawing money, contribute tax-free now</li>
                        <li>For those who expect to be in a lower tax bracket in the future</li>
                      </ul>
                    </li>
                  </ul>
                  <Link href="/contact-us" className="homepage-investor-roadmap-section-roadmap-step-button">
                    <h4>Speak To Us About Your Goals</h4>
                  </Link>
                </div>
                <div className="homepage-investor-roadmap-section-step-icon-container">
                  <div className="homepage-investor-roadmap-section-step-icon">
                    <Image
                      src={"/images/icons/investant-path-icon.png"}
                      alt="Investant Path From Here To There Icon"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
              <div className="homepage-investor-roadmap-section-roadmap-step reversed">
                <div className="homepage-investor-roadmap-section-step-icon-container">
                  <div className="homepage-investor-roadmap-section-step-icon">
                    <Image
                      src={"/images/icons/investant-wallet-icon.png"}
                      alt="Investant Wallet Icon"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
                <div className="homepage-investor-roadmap-section-roadmap-step-commentary">
                  <h2 style={{fontWeight: 'bold', color: 'black'}}>Step 2: Choose Your Path</h2>
                  <ul style={{listStyle: 'inside'}}><br/>
                    <li><span style={{fontWeight: 'bold'}}>DIY {'(Do It Yourself)'}</span>
                      <ul style={{marginLeft: '20px'}}>
                        <li><span style={{fontWeight: 'bold', color: '#2D64A9'}}>Pro:</span> Cheaper expense ratios through use of index funds</li>
                        <li><span style={{fontWeight: 'bold', color: '#2D64A9'}}>Pro:</span> More flexibility & oversight</li>
                        <li><span style={{fontWeight: 'bold', color: '#820EA9'}}>Con:</span> Easier to make emotional & impulsive decisions</li>
                      </ul>
                    </li>
                    <br/>
                    <li><span style={{fontWeight: 'bold'}}>Financial Advisor</span>
                      <ul style={{marginLeft: '20px'}}>
                        <li><span style={{fontWeight: 'bold', color: '#2D64A9'}}>Pro:</span> Unemotional decision making</li>
                        <li><span style={{fontWeight: 'bold', color: '#2D64A9'}}>Pro:</span> Financial planning assistance {'(tax, estate, etc.)'}</li>
                        <li><span style={{fontWeight: 'bold', color: '#820EA9'}}>Con:</span> High management fees with AUM {'(Assets Under Management)'} model</li>
                      </ul>
                    </li>
                  </ul>
                  <Link href="/blog" className="homepage-investor-roadmap-section-roadmap-step-button">
                    <h4>The Power Of Doing It Yourself</h4>
                  </Link>
                </div>
              </div>
              <div className="homepage-investor-roadmap-section-roadmap-step">
                <div className="homepage-investor-roadmap-section-roadmap-step-commentary">
                  <h2 style={{fontWeight: 'bold', color: 'black'}}>Step 3: Build Your Future</h2>
                  <p><br/>{`It's`} time to start funding your portfolio! Most individuals get paid on a biweekly basis, so we recommend setting up monthly contributions to your accounts on the first of each month. Budget and save your paycheck!</p>
                  <p><br/>To set-up recurring deposits, check with your financial advisor or click on your broker below.</p>
                  <div className="homepage-investor-roadmap-section-roadmap-commentary-images-container">
                    <div className="homepage-investor-roadmap-section-roadmap-commentary-image">
                      <Link href={'https://vanguard.com'} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={"/images/icons/VanguardIcon.png"}
                          alt="Vanguard Icon and Link"
                          width={100}
                          height={100}
                        />
                      </Link>
                    </div>
                    <div className="homepage-investor-roadmap-section-roadmap-commentary-image">
                      <Link href={'https://www.fidelity.com'} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={"/images/icons/FidelityIcon.png"}
                          alt="Fidelity Icon and Link"
                          width={100}
                          height={100}
                        />
                      </Link>
                    </div>
                    <div className="homepage-investor-roadmap-section-roadmap-commentary-image">
                      <Link href={'https://schwab.com'} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={"/images/icons/CharlesSchwabIcon.png"}
                          alt="Charles Schwab Icon and Link"
                          width={100}
                          height={100}
                        />
                      </Link>
                    </div>
                  </div>
                  <Link href="/products" className="homepage-investor-roadmap-section-roadmap-step-button">
                    <h4>Use The Investant Financial Planner</h4>
                  </Link>
                </div>
                <div className="homepage-investor-roadmap-section-step-icon-container">
                  <div className="homepage-investor-roadmap-section-step-icon">
                    <Image
                      src={"/images/icons/investant-money-bag-icon.png"}
                      alt="Investant Money Bag Icon"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
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
                      priority={true}
                    />
                  </div>
                  <div className="homepage-featured-blog-posts-section-top-post-description-container">
                    <h3>{featuredPost.attributes.Title}</h3>
                    <h4>{featuredPost.attributes.BlogPostDescription}</h4>
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
        </main>
      </DefaultLayout>
    </>
  );
};