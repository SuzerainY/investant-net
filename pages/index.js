import { STRAPIurl, formatDate, blogPostReadLengthText } from '@/my_modules/bloghelp';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidEmail } from '@/my_modules/authenticationhelp';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from "next/head";
import Image from "next/image";
import DefaultLayout from "@/layouts/DefaultLayout";

export async function getServerSideProps(context) {
  // Fetch 10 most recent posts for inital page render
  let fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query GetBlogPosts {
          blogPosts(pagination: { pageSize: 10 }, sort: "PublishDate:desc") {
            data {
              id
              attributes {
                Title
                BlogPostBody
                BlogPostDescription
                SLUG
                Author
                PublishDate
                SPLASH {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
            meta {
              pagination {
                total
                pageSize
                page
                pageCount
              }
            }
          }
        }
      `
    })
  };
  let res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const blogData = await res.json();

  fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query GetHomePageHero {
          homePageHero {
            data {
              id
              attributes {
                TopLine
                BottomLine
                Subtext
              }
            }
          }
        }
      `
    })
  };
  res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const heroData = await res.json();
  return { props: { blogData, heroData } };
};

export default function Home(props) {
  const router = useRouter();
  const [info, setInfo] = useState('') ;
  const [error, setError] = useState('');

  const [postCount, setPostCount] = useState(props?.blogData?.data?.blogPosts?.data?.length);
  const [hasMorePosts, setHasMorePosts] = useState(postCount < props?.blogData?.data?.blogPosts?.meta?.pagination?.total);
  const [displayedPosts, setDisplayedPosts] = useState(props?.blogData?.data?.blogPosts?.data?.slice(1));

  const mostRecentPost = props?.blogData?.data?.blogPosts?.data[0];

  const loadMorePosts = async () => {
    const currentCount = postCount;
    const fetchParams = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query GetMoreBlogPosts {
            blogPosts(pagination: { limit: 9, start: ${currentCount} }, sort: "PublishDate:desc") {
              data {
                id
                attributes {
                  Title
                  BlogPostBody
                  BlogPostDescription
                  SLUG
                  Author
                  PublishDate
                  SPLASH {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
              meta {
                pagination {
                  total
                }
              }
            }
          }
        `
      })
    };
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const newData = await res.json();
    
    setDisplayedPosts(prevPosts => [...prevPosts, ...newData?.data.blogPosts?.data]);
    setPostCount(currentCount + newData?.data?.blogPosts?.data?.length);
    setHasMorePosts(currentCount + newData?.data?.blogPosts?.data?.length < newData?.data?.blogPosts?.meta?.pagination?.total);
  };

  useEffect(() => {
    const loadGoogleRecaptcha = () => {
      const googleRecaptchaScript = document.createElement('script');
      googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
      googleRecaptchaScript.async = true;
      googleRecaptchaScript.defer = true;
      document.body.appendChild(googleRecaptchaScript);
    }; loadGoogleRecaptcha();
  }, []);

  // Handle the Newsletter Signup form
  const [newsletterSignUpEmail, setNewsletterSignUpEmail] = useState('');
  const handleNewsletterSignUp = (e) => {
    if (e) {e.preventDefault();}
    setError('');
    setInfo('');

    if (isValidEmail(newsletterSignUpEmail) === false) {
      setError('Invalid Email Address');
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_BlogPage_Email_Subscription_Form_Submission' }).then(async (token) => {
        try {
          // Google Recaptcha Verification
          if (await verifyGoogleRecaptcha(token) !== true) {
            setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
            return;
          }

          // POST request for entry creation
          const response = await fetch(`${STRAPIurl}/api/public-blog-subscribers`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              data: {
                Email: newsletterSignUpEmail,
                DateSubscribed: new Date().toISOString()
              }
            })
          });
          const data = await response.json();

          if (!response.ok) {
            // Handle Known Errors
            if (data.error.message === 'This attribute must be unique') {
              setInfo('');
              setError('Email Is Already Subscribed!');
              return;
            }            
            throw new Error('Unaccounted For Error Occurred.');
          }

          setInfo('Successfully Subscribed!');
        } catch (error) {setError('Unable To Subscribe. Please Contact Us If The Issue Persists.');}
      });
    });
  };

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
            <div className="blogpage-title-section">
              <div className="blogpage-title-section-text-container">
                <div className="blogpage-title-section-title">
                  <h1>{props.heroData?.data?.homePageHero?.data?.attributes?.TopLine ? props.heroData?.data?.homePageHero?.data?.attributes?.TopLine : 'Short stories about'}
                    <br/>
                    <span className="blogpage-title-section-title-span">{props.heroData?.data?.homePageHero?.data?.attributes?.BottomLine ? props.heroData?.data?.homePageHero?.data?.attributes?.BottomLine : 'wealth, behavior, and life'}</span>
                  </h1>
                </div>
                <div className="blogpage-title-section-subtitle">
                  <p>{props.heroData?.data?.homePageHero?.data?.attributes?.Subtext ? props.heroData?.data?.homePageHero?.data?.attributes?.Subtext : 'Subscribe to our newsletter'}</p>
                  {info && (<p style={{fontSize: '16px', color: '#40C9FF', paddingTop: '5px', marginBottom: '-10px'}}>{info}</p>)}
                  {error && (<p style={{fontSize: '16px', color: '#FFCC00', paddingTop: '5px', marginBottom: '-10px'}}>{error}</p>)}
                </div>
              </div>
              <div className="blogpage-title-join-newsletter-section">
                <div className="blogpage-title-join-newsletter-section-sign-up-container">
                  <div className="blogpage-title-join-newsletter-section-sign-up-input-container">
                    <input
                      type="email"
                      placeholder="Email"
                      className="blogpage-title-join-newsletter-section-sign-up-email-box"
                      value={newsletterSignUpEmail}
                      onChange={(e) => setNewsletterSignUpEmail(e.target.value)}
                    />
                    <button className="blogpage-title-join-newsletter-section-sign-up-button" onClick={handleNewsletterSignUp}>
                      <h4>Subscribe</h4>
                    </button>
                  </div>
                </div>
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
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-2">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_2_White_Star.svg"}
                  alt="homepage hero section hero piece 2"
                  fill={true}
                />
              </div>
              <div  className="homepage-hero-section-hero-piece-3">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_3_Flower.svg"}
                  alt="homepage hero section hero piece 3"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-4">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_4_Green_Star.svg"}
                  alt="homepage hero section hero piece 4"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-5">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_5_Coins.svg"}
                  alt="homepage hero section hero piece 5"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-6">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_6_Person.svg"}
                  alt="homepage hero section hero piece 6"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-7">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_7_Pink_Star_1.svg"}
                  alt="homepage hero section hero piece 7"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-8">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_8_Pink_Star_2.svg"}
                  alt="homepage hero section hero piece 8"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-9">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_9_Blue_Star.svg"}
                  alt="homepage hero section hero piece 9"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-10">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_10_Yellow_Star.svg"}
                  alt="homepage hero section hero piece 10"
                  fill={true}
                />
              </div>
              <div className="homepage-hero-section-hero-piece-11">
                <Image
                  src={"/images/clipart/OfficeWorkerHeroComponents/Piece_11_Graph.svg"}
                  alt="homepage hero section hero piece 11"
                  fill={true}
                />
              </div>
            </div>
          </section>

          <section className="blogpage">
            <div className="blogpage-main-body-wrapper">
              <div className="blogpage-post-content-wrapper">
                <div className="blogpage-featured-post-section">
                  <Link href={`/blog/${mostRecentPost?.attributes.SLUG}`} className="blogpage-featured-post-section-content-wrapper">
                    <div className="blogpage-featured-post-section-image-container">
                      {mostRecentPost?.attributes.SPLASH.data.attributes.url && (
                        <Image
                          src={`${mostRecentPost?.attributes.SPLASH.data.attributes.url}`}
                          alt={mostRecentPost?.attributes.Title}
                          priority={true}
                          width={1000}
                          height={500}
                        />
                      )}
                    </div>
                    <div className="blogpage-featured-post-section-text-container">
                      <div className="blogpage-featured-post-section-title">
                        <h1>{mostRecentPost?.attributes.Title}</h1>
                      </div>
                      <div className="blogpage-featured-post-section-title">
                        <p><span style={{color: '#2D64A9'}}>{mostRecentPost?.attributes.Author}</span> | {formatDate(new Date(mostRecentPost?.attributes.PublishDate))}</p>
                      </div>
                      <div className="blogpage-featured-post-section-description">
                        <p>{mostRecentPost?.attributes.BlogPostDescription}</p>
                      </div>
                      <div className="blogpage-featured-post-section-read-length">
                        <p>{blogPostReadLengthText(mostRecentPost?.attributes.BlogPostBody)}</p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className={displayedPosts?.length % 3 !== 0 ? 'blogpage-blog-posts-wrapper not-even-three' : 'blogpage-blog-posts-wrapper'}>
                  <div className="blogpage-blog-post-list">
                    {displayedPosts?.map((post, index) => (
                      <div key={post.id} className="blogpage-blog-post">
                        <Link href={`/blog/${post.attributes.SLUG}`}>
                          <div className="blogpage-blog-post-image-container">
                            <Image
                              src={`${post.attributes.SPLASH.data.attributes.url}`}
                              alt={post.attributes.Title}
                              width={1000}
                              height={500}
                            />
                          </div>
                          <div className="blogpage-blog-post-text-container">
                            <h2>{post.attributes.Title}</h2>
                            <p style={{paddingBottom: '10px'}}><span style={{color: '#2D64A9'}}>{post.attributes.Author}</span> | {formatDate(new Date(post.attributes.PublishDate))}</p>
                            <div className="blogpage-blog-post-description-container">
                              <p>{post.attributes.BlogPostDescription}</p>
                            </div>
                            <p className="blogpage-blog-post-read-length">{blogPostReadLengthText(post.attributes.BlogPostBody)}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  {(hasMorePosts === true) && (
                    <button onClick={loadMorePosts} className="load-more-button">
                      Load More
                    </button>
                  )}
                </div>
              </div>

              <div className="blogpage-sidebar-section">
                <div className="blogpage-investant-product-container">
                  <div className="blogpage-investant-product-content">
                    <h3>Investant | Our Story</h3>
                    <p>Investant is a platform for financial tools, literacy, & education.</p>
                    <ul>
                      <li>Long-term wealth practices</li>
                      <li>Financial literacy for all</li>
                      <li>Built for the new professional</li>
                    </ul>
                    <Link href="/about-us" className="blogpage-investant-product-button">Learn More</Link>
                    <p className="blogpage-investant-product-footer">Investant.net - Your partner in financial growth</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  );
};