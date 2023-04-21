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
  const blogPosts = props.data.blogPosts.data;
  
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
          <div className="blog-post-list">
            {blogPosts.map((post) => (
              <Link key={post.attributes.SLUG} href={`/blog/${post.attributes.SLUG}`}>
                <div className="blog-post">
                  <h3>{post.attributes.Title}</h3>
                  <p>{post.attributes.BlogPostDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </DefaultLayout>
      </div>
    </>
  )
}