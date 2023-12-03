import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultLayout from '@/layouts/DefaultLayout';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

// The URL for our STRAPI app backend stored in environment variables
const STRAPIurl = process.env.NEXT_PUBLIC_STRAPIBASEURL;

// Fetch the SLUG for the selected BlogPost in order to route the new URL properly
export async function getServerSidePaths() {
    const fetchParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `{
                blogPosts {
                    data {
                        attributes {
                            SLUG
                        }
                    }
                }
            }`
        })
    }
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const data = await res.json();
    const paths = data.data.blogPosts.data.map((post) => ({
        params: { slug: post.attributes.SLUG },
    }));
    return { paths, fallback: true };
}

// Fetch the selected blog from the server via graphql
export async function getServerSideProps({ params }) {
    const slug = params.slug;

    const fetchParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query getBlogPost($slug: String!){
                    blogPosts(filters: {SLUG: {eq: $slug}}) {
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
            `,
            variables: {"slug": slug} // Select the BlogPost with this specific SLUG (every BlogPost has a unique SLUG)
        })
    }
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const data = await res.json();
    return { props: data };
}

export default function BlogPost(props) {
    const post = props.data.blogPosts.data[0];
    const readWPM = 200; // Assumption for how many words per minute the average reader can read

    // If it takes 1 minute to read post, display "minute", else "minutes"
    const postTimeToRead = Math.ceil(String(post.attributes.BlogPostBody).split(' ').length / readWPM);
    if (postTimeToRead === 1) {
      var postTimeText = '~ 1 minute'
    }
    else {
      var postTimeText = `~ ${postTimeToRead} minutes`
    }

    /*
    // Image URIs from our STRAPI Media Content Folders appear in the body as: (/uploads/ImageNamehere.png)
    // This method will adjust them to: (`${STRAPIurl}/uploads/ImageNamehere.png`) so that we properly fetch the image and display on site
    function ParseImageURL(post) {
        var BlogPostBody = String(post.attributes.BlogPostBody);
        var BlogPostBodyMarkdown = "";

        function recursiveParse(BlogPostBody) {
            let openUriIndex = 0;
            let closeUriIndex = 0;
            // Iterate through each instance of "(" searching for "/uploads" afterwards
            for (let i = 0; i < BlogPostBody.length; i++) {
                
                if (BlogPostBody[i] === "(" && i + 9 < BlogPostBody.length && BlogPostBody.substring(i + 1, i + 9) === "/uploads") {
                    // i must be the opening parenthesis of this URI
                    openUriIndex = i
    
                    // Fetch the closing parenthesis of this URI
                    for (let j = openUriIndex; j < BlogPostBody.length; j++) {
                        if (BlogPostBody[j] === ")") {
                            closeUriIndex = j;
                            break;
                        }
                    }
    
                    // Insert the correct URI address to the image
                    // let NewUri = `http://localhost:1337${BlogPostBody.substring(openUriIndex + 1, closeUriIndex + 1)}`;
                    let NewUri = `${STRAPIurl}${BlogPostBody.substring(openUriIndex + 1, closeUriIndex + 1)}`;
                    BlogPostBodyMarkdown = BlogPostBody.substring(0, openUriIndex + 1) + NewUri + BlogPostBody.substring(closeUriIndex + 1);
                    recursiveParse(BlogPostBodyMarkdown);
                }
            }
            return BlogPostBodyMarkdown
        }
        return recursiveParse(BlogPostBody);
    }
    var BlogPostBodyMarkdown = ParseImageURL(post);
    */

    // Return a Date() object as yyyy-mm-dd
    function formatDate(date) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    const router = useRouter();
    // Render a loading state while data is being fetched
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{`Investant | ${post.attributes.Title}`}</title>
                <meta name="description" content={post.attributes.BlogPostDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Investant | ${post.attributes.Title}`} />
                <meta name="twitter:description" content={post.attributes.BlogPostDescription} />
                <meta name="twitter:image" content={`${post.attributes.SPLASH.data.attributes.url}`} />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content={`Investant | ${post.attributes.Title}`} />
                <meta property="og:description" content={post.attributes.BlogPostDescription} />
                <meta property="og:image" content={`${post.attributes.SPLASH.data.attributes.url}`} />
                <meta property="og:url" content="https://investant.net" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>
            <div className='slug-page-background-color'>
                <DefaultLayout>
                    <main className='slug-page'>
                        <h1 className='slug-page-title'>{post.attributes.Title}</h1>
                        <div className='slug-page-author-date'>
                            <h2>{post.attributes.Author}</h2>
                            <h4>{formatDate(new Date(post.attributes.PublishDate))}</h4>
                        </div>
                        <div className='slug-page-time-text'>
                            <p>{postTimeText}</p>
                        </div>
                        <Image className='slug-page-image'
                            src={`${post.attributes.SPLASH.data.attributes.url}`}
                            alt={post.attributes.Title}
                            width={800}
                            height={600}
                        />
                        <div className='slug-page-body'>
                            <ReactMarkdown className='html'>{post.attributes.BlogPostBody}</ReactMarkdown>
                        </div>
                    </main>
                </DefaultLayout>
            </div>
        </>
    );
}