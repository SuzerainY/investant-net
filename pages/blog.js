import Head from 'next/head';
import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';

const STRAPIurl = process.env.STRAPIBASEURL

export async function getStaticProps(context) {
  const fetchParams = {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `{
        blogPosts {
          data {
            attributes {
              Title
              BlogPostBody
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
      }`
    })
  }

  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();

  return {
    props: data
  };
}

export default function Blog(props) {
  const data = props.data.blogPosts.data;
  const mostRecentPost = data[data.length - 1]; // Get the last post
  const blogPosts = data.slice(0, -1).reverse(); // Create a new array with the rest of the posts in reverse order such that most recently posted come last

  return (
    <>
      <Head>
        <title>Investant | Blog</title>
        <meta
          name="twitter:description"
          content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="twitter:image"
          content="images/branding/TransparentLogo.svg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="images/branding/FaviconTransparent.png" />
      </Head>
      <div className="homepage">
        <DefaultLayout>
          {/* Display the most recent post outside the mapping */}
          <div className="blog-post featured-post">
            <Link key={mostRecentPost.attributes.SLUG} href={`/blog/${mostRecentPost.attributes.SLUG}`}>
              <img
                className="slug-page-image"
                src={`http://localhost:1337${mostRecentPost.attributes.SPLASH.data.attributes.url}`}
                alt={mostRecentPost.attributes.Title}
                width={600}
                height={300}
              />
              <h2>{mostRecentPost.attributes.Title}</h2>
              <p>{mostRecentPost.attributes.BlogPostDescription}</p>
            </Link>
          </div>
          <div className="blog-post-list">
            {/* Loop through other blog posts */}
            {blogPosts.map((post) => (
              <div className="blog-post" key={post.attributes.SLUG}>
                <Link href={`/blog/${post.attributes.SLUG}`}>
                  <img
                    className="slug-page-image"
                    src={`http://localhost:1337${post.attributes.SPLASH.data.attributes.url}`}
                    alt={post.attributes.Title}
                    width={600}
                    height={300}
                  />
                  <h2>{post.attributes.Title}</h2>
                  <p>{post.attributes.BlogPostDescription}</p>
                </Link>
              </div>
            ))}
          </div>
        </DefaultLayout>
      </div>
    </>
  )
}