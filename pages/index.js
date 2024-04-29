import { STRAPIurl, blogPostReadLengthText } from '@/my_modules/bloghelp';
import { useState } from 'react';
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

  const [openCardIndex, setOpenCardIndex] = useState(0);
  const handleCardHover = (index) => {setOpenCardIndex(index);}

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
          <section className="homepage-hero-section">
            <div className="homepage-hero-section-text-container">
              <h1>
                Personal Finance
                <br/>
                <span className="homepage-hero-section-text-span">Made Simple.</span>
              </h1>
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
          <section className="homepage-divider-1">
            <div className="homepage-divider-1-text-container">
              <h2>Your Roadmap to Financial Freedom</h2>
            </div>
          </section>
          <section className="homepage-featured-blog-posts-section">
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
                      <div className="homepage-blog-post-card-icon" style={{ background: ["#1B0053", "#40C9FF", "#E81CFF"][index % 3] }}>
                        {index + 1}
                      </div>
                      <div className="homepage-blog-post-card-description">
                        <h4>{post.attributes.Title}</h4>
                        <p>{post.attributes.BlogPostDescription}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}