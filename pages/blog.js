import Head from 'next/head';
import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';
import Image from 'next/image';
import WritingSignatureIcon from '/public/images/icons/WritingSignature.png';

const STRAPIurl = process.env.NEXT_PUBLIC_STRAPIBASEURL;

export async function getServerSideProps(context) {
  const fetchParams = {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `
        {
          blogPosts {
            data {
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
  const data = props.data.blogPosts.data;
  const mostRecentPost = data[data.length - 1]; // Get the most recent post
  const blogPosts = data.slice(0, -1).reverse(); // Create a new array with the rest of the posts in reverse order such that most recently posted come last
  const readWPM = 200; // Assumption for how many words per minute the average reader can read

  // If it takes 1 minute to read post, display "minute", else "minutes"
  const mostRecentPostTimeToRead = Math.ceil(String(mostRecentPost.attributes.BlogPostBody).split(' ').length / readWPM);
  if (mostRecentPostTimeToRead === 1) {
    var mostRecentPostTimeText = '~ 1 minute'
  }
  else {
    var mostRecentPostTimeText = `~ ${mostRecentPostTimeToRead} minutes`
  }

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
          {/* Display the most recent post outside the mapping */}
          <div className="featured-post">
            <Link key={mostRecentPost.attributes.SLUG} href={`/blog/${mostRecentPost.attributes.SLUG}`}>
              <Image
                className="slug-page-image"
                src={`${mostRecentPost.attributes.SPLASH.data.attributes.url}`}
                alt={mostRecentPost.attributes.Title}
                width={600}
                height={300}
              />
              <h1>{mostRecentPost.attributes.Title}</h1>
              <div className="blog-post-image-description">
                <Image
                  src={WritingSignatureIcon}
                  alt={"Essay"}
                  width={100}
                  height={100}
                />
                <p>{mostRecentPost.attributes.BlogPostDescription}</p>
              </div>
              <div className="blog-post-read-length">
                {/* Calculate approximate minutes to read. Counting number of words by number of spaces in essay. */}
                <p>{mostRecentPostTimeText}</p>
              </div>
            </Link>
          </div>
          <div className="divider-1"></div>
          <div className="blog-post-list">
            {/* Loop through other blog posts */}
            {blogPosts.map((post) => (
              <div className="blog-post" key={post.attributes.SLUG}>
                <Link href={`/blog/${post.attributes.SLUG}`}>
                  <Image
                    className="slug-page-image"
                    src={`${post.attributes.SPLASH.data.attributes.url}`}
                    alt={post.attributes.Title}
                    width={600}
                    height={300}
                  />
                  <h2>{post.attributes.Title}</h2>
                  <div className="blog-post-image-description">
                    <Image
                    src={WritingSignatureIcon}
                    alt={"Essay"}
                    width={100}
                    height={100}
                    />
                    <p>{post.attributes.BlogPostDescription}</p>
                  </div>
                  <div className="blog-post-read-length">
                    {/* Calculate approximate minutes to read. Counting number of words by number of spaces in essay. */}
                    <p>{Math.ceil(String(post.attributes.BlogPostBody).split(' ').length / readWPM) === 1 ? '~ 1 minute' : `~ ${Math.ceil(String(post.attributes.BlogPostBody).split(' ').length / readWPM)} minutes`}</p>
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