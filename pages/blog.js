import { STRAPIurl, blogPostReadLengthText } from '@/my_modules/bloghelp';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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
          blogPosts(pagination: { pageSize: 15 }, sort: "id:desc") {
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
          }
        }
      `
    })
  }
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
}

export default function Blog(props) {

  // Arrange blog post data and variables
  const data = props.data.blogPosts.data;
  const mostRecentPost = data[0]; // Get the most recent post
  // let filterPostId = mostRecentPost.id; // When we fetch more posts, we will use this ID in a 'lt' (less than) filter clause to ensure we grab the next 15 earliest posts
  const blogPosts = data.slice(1); // The rest of the blog posts with the mostRecentPost removed

  return (
    <>
      <Head>
        <title>Investant | Blog</title>
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
        <main className="blogpage">
          <section className="blogpage-title-background">
            <div className="blogpage-title-wrapper">
              <div className="blogpage-title">
                <h1>Explore Our Latest Blog Posts</h1>
                <h3>At <span className="blogpage-title-span">investant.net</span>, we aim to provide independent financial research and tools for <span className="blogpage-title-span">your</span>{" financial literacy and education in today's economy."}</h3>
              </div>
              <div className="blogpage-featured-post">
                <Link key={mostRecentPost.attributes.SLUG} href={`/blog/${mostRecentPost.attributes.SLUG}`}>
                  <div className="blogpage-featured-post-image-container">
                    <Image
                      src={`${mostRecentPost.attributes.SPLASH.data.attributes.url}`}
                      alt={mostRecentPost.attributes.Title}
                      priority={true}
                      width={1000}
                      height={500}
                    />
                  </div>
                  <div className="blogpage-featured-post-text-container">
                    <h2>{mostRecentPost.attributes.Title}</h2>
                    <div className="blogpage-featured-post-description-container">
                      <p>{mostRecentPost.attributes.BlogPostDescription}</p>
                    </div>
                    <div className="blogpage-blog-post-read-length">
                      <p>{blogPostReadLengthText(mostRecentPost.attributes.BlogPostBody)}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
          <section className="blogpage-blog-posts-wrapper">
            <div className="blogpage-blog-post-list">
              {blogPosts.map((post, index) => (
                <div key={index} className="blogpage-blog-post">
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
                      <div className="blogpage-blog-post-description-container">
                        <p>{post.attributes.BlogPostDescription}</p>
                      </div>
                      <p className="blogpage-blog-post-read-length">{blogPostReadLengthText(post.attributes.BlogPostBody)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
      </DefaultLayout>
    </>
  )
}