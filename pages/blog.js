import Head from 'next/head';
import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';
import Image from 'next/image';

const STRAPIurl = process.env.NEXT_PUBLIC_STRAPIBASEURL;

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

  const readWPM = 200; // Assumption for how many words per minute the average reader can read

  // This function takes a blog post and our assumption for WPM the average reader reads to calculate approximately how long it will take to read the post
  const blogPostReadLengthText = (post, readWPM) => {
    let spaceCount = 0;
    const blogPostBody = post.attributes.BlogPostBody;
    for (let i = 0; i < blogPostBody.length; i++) {
      if (blogPostBody[i] === " ") {
        spaceCount++;
      }
    }
    const blogPostTimeToRead = Math.ceil(spaceCount / readWPM);
    // If it only takes 1 minute to read, return "minute", else we'll return "minutes" below
    if (blogPostTimeToRead === 1 || blogPostTimeToRead === 0) {
      return '~ 1 minute'
    } else {
      return `~ ${blogPostTimeToRead} minutes`
    }
  };

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

      <div className="blogpage">
        <DefaultLayout>
          <div className="blogpage-title">
            <h1>Explore Our Latest Blog Posts</h1>
          </div>
          {/* Display the most recent post front and center */}
          <div className="featured-post">
            <Link key={mostRecentPost.attributes.SLUG} href={`/blog/${mostRecentPost.attributes.SLUG}`}>
              <div class="featured-post-image-container">
                <Image
                  className="img"
                  src={`${mostRecentPost.attributes.SPLASH.data.attributes.url}`}
                  alt={mostRecentPost.attributes.Title}
                  width={1200}
                  height={600}
                />
              </div>
              <div className="featured-post-text-container">
                <h1>{mostRecentPost.attributes.Title}</h1>
                <div className="blog-post-image-description">
                  <p>{mostRecentPost.attributes.BlogPostDescription}</p>
                </div>
                <div className="blog-post-read-length">
                  {/* Calculate approximate minutes to read.*/}
                  <p>{blogPostReadLengthText(mostRecentPost, readWPM)}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="blog-post-list">
            {/* Loop through other blog posts */}
            {blogPosts.map((post) => (
              <div className="blog-post" key={post.attributes.SLUG}>
                <Link key={post.attributes.SLUG} href={`/blog/${post.attributes.SLUG}`}>
                  <div className="blog-post-image-container">
                    <Image
                      className="slug-page-image"
                      src={`${post.attributes.SPLASH.data.attributes.url}`}
                      alt={post.attributes.Title}
                      width={600}
                      height={300}
                    />
                  </div>
                  <div className="blog-post-text-container">
                    <h2>{post.attributes.Title}</h2>
                    <p className="blog-post-description">{post.attributes.BlogPostDescription}</p>
                    {/* Calculate approximate minutes to read.*/}                    
                    <p className="blog-post-read-length">{blogPostReadLengthText(post, readWPM)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </DefaultLayout>
      </div>
    </>
  )
}