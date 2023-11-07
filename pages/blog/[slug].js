import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultLayout from '@/layouts/DefaultLayout';
import ReactMarkdown from 'react-markdown';

const STRAPIurl = process.env.STRAPIBASEURL

export async function getStaticPaths() {
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

export async function getStaticProps({ params }) {
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
            variables: {"slug": slug}
        })
    }
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const data = await res.json();
    return {
        props: data
    };
}

export default function BlogPost(props) {
    const post = props.data.blogPosts.data[0];

    // Image URIs from our STRAPI Media Content Folders appear in the body as: (/uploads/ImageNamehere.png)
    // This method will adjust them to: (`${STRAPIurl}/uploads/ImageNamehere.png`) so that we properly fetch the image and display on site
    function ParseImageURL(post) {
        var BlogPostBody = post.attributes.BlogPostBody;
        var BlogPostBodyMarkdown = "";

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
                let NewUri = `http://localhost:1337${BlogPostBody.substring(openUriIndex + 1, closeUriIndex + 1)}`;
                BlogPostBodyMarkdown = BlogPostBody.substring(0, openUriIndex + 1) + NewUri + BlogPostBody.substring(closeUriIndex + 1);
            }
        }
        return BlogPostBodyMarkdown;
    }
    var BlogPostBodyMarkdown = ParseImageURL(post);

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
                <meta
                name="twitter:description"
                content={post.attributes.BlogPostDescription}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="twitter:image" content={post.attributes.SPLASH.data.url} />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="icon" href="images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <div className='default-layout'>
                    <main className='slug-page'>
                        <h1 className='slug-page-title'>{post.attributes.Title}</h1>
                        <img className='slug-page-image'
                            src={`http://localhost:1337${post.attributes.SPLASH.data.attributes.url}`}
                            alt={post.attributes.Title}
                            width={800}
                            height={600}
                        />
                        <div className='slug-page-body'>
                            <ReactMarkdown>{BlogPostBodyMarkdown}</ReactMarkdown>
                        </div>
                    </main>
                </div>
            </DefaultLayout>
        </>
    );
}