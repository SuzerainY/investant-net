import { STRAPIurl, formatDate, blogPostReadLengthText } from '@/my_modules/bloghelp';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import DefaultLayout from '@/layouts/DefaultLayout';

export async function getServerSideProps(context) {
  // Fetch 15 most recent posts for inital page render
  const fetchParams = {
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
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
};

export default function Blog(props) {
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(page < props.data.blogPosts.meta.pagination.pageCount);
  const [displayedPosts, setDisplayedPosts] = useState(props.data.blogPosts.data.slice(1));

  const mostRecentPost = props.data.blogPosts.data[0];

  const loadMorePosts = async () => {
    const nextPage = page + 1;
    const fetchParams = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query GetMoreBlogPosts {
            blogPosts(pagination: { page: ${nextPage}, pageSize: 9 }, sort: "PublishDate:desc") {
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
                  pageCount
                }
              }
            }
          }
        `
      })
    };
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const newData = await res.json();
    
    setDisplayedPosts(prevPosts => [...prevPosts, ...newData.data.blogPosts.data]);
    setPage(nextPage);
    setHasMorePosts(nextPage < newData.data.blogPosts.meta.pagination.pageCount);
  };

  return (
    <>
      <Head>
        <title>Investant | Blog</title>
        <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investant | Blog" />
        <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

        {/* Open Graph Meta Tags (for platforms like Facebook) */}
        <meta property="og:title" content="Investant | Blog" />
        <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
        <meta property="og:url" content="https://investant.net/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Investant" />

        {/* Favicon */}
        <link rel="icon" href="/images/branding/FaviconTransparent.png" />
      </Head>

      <DefaultLayout>
        <main className="blogpage">
          <section className="blogpage-title-section">
            <div className="blogpage-title-section-text-container">
              <div className="blogpage-title-section-title">
                <h1>The <span className="blogpage-title-section-title-span">Investant</span> Blog</h1>
              </div>
              <div className="blogpage-title-section-subtitle">
                <p>Join us in the pursuit for financial <span className="blogpage-title-section-subtitle-span">freedom.</span></p>
              </div>
            </div>
          </section>

          <div className="blogpage-main-body-wrapper">
            <div className="blogpage-post-content-wrapper">
              <section className="blogpage-featured-post-section">
                <Link href={`/blog/${mostRecentPost.attributes.SLUG}`} className="blogpage-featured-post-section-content-wrapper">
                  <div className="blogpage-featured-post-section-image-container">
                    <Image
                      src={`${mostRecentPost.attributes.SPLASH.data.attributes.url}`}
                      alt={mostRecentPost.attributes.Title}
                      priority={true}
                      width={1000}
                      height={500}
                    />
                  </div>              
                  <div className="blogpage-featured-post-section-text-container">
                    <div className="blogpage-featured-post-section-title">
                      <h1>{mostRecentPost.attributes.Title}</h1>
                    </div>
                    <div className="blogpage-featured-post-section-title">
                      <p><span style={{color: '#2D64A9'}}>{mostRecentPost.attributes.Author}</span> | {formatDate(new Date(mostRecentPost.attributes.PublishDate))}</p>
                    </div>
                    <div className="blogpage-featured-post-section-description">
                      <p>{mostRecentPost.attributes.BlogPostDescription}</p>
                    </div>
                    <div className="blogpage-featured-post-section-read-length">
                      <p>{blogPostReadLengthText(mostRecentPost.attributes.BlogPostBody)}</p>
                    </div>
                  </div>
                </Link>
              </section>

              <section className="blogpage-blog-posts-wrapper">
                <div className="blogpage-blog-post-list">
                  {displayedPosts.map((post, index) => (
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
                {hasMorePosts && (
                  <button onClick={loadMorePosts} className="load-more-button">
                    Load More
                  </button>
                )}
              </section>
            </div>

            <section className="blogpage-sidebar-section">
              <div className="blogpage-investant-product-container">
                <div className="blogpage-investant-product-content">
                  <h3>Take Control of Your Finances</h3>
                  <p>Discover our powerful Financial Planner</p>
                  <ul>
                    <li>Create personalized budget plans</li>
                    <li>Get insights for financial success</li>
                    <li>Save and track your progress</li>
                  </ul>
                  <Link href="/products?block=FinancialPlanner" className="blogpage-investant-product-button">Start Planning Now</Link>
                  <p className="blogpage-investant-product-footer">Investant.net - Your partner in financial growth</p>
                </div>
              </div>
            </section>
          </div>

        </main>
      </DefaultLayout>
    </>
  );
};