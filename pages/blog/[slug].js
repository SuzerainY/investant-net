import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultLayout from '@/layouts/DefaultLayout';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import Image from 'next/image';
import { useEffect } from 'react';

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
                query getBlogPost($slug: String!) {
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

// Custom component to conditionally render Cloudinary images as Next.js Image components
const CustomImage = ({ alt, src }) => {
    // Check if the image src contains 'https://res.cloudinary.com'  
    if (src.includes('https://res.cloudinary.com')) {
        return (
            <Image
                alt={alt || ''}
                src={src}
                width={800}
                height={600}
            />
        );
    } else {
        // Return the original <img> tag for non-Cloudinary images
        return <img alt={alt || ''} src={src}/>;
    }
};

export default function BlogPost(props) {
    const router = useRouter();
    const post = props.data.blogPosts.data[0];
    const readWPM = 200; // Assumption for how many words per minute the average reader can read

    // This function takes a blog post and our assumption for WPM the average reader reads to calculate approximately how long it will take to read the post
    function blogPostReadLengthText(post, readWPM) {
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

    // We need to parse the HTML and handle for edge cases:
    // - Parse the original Markdown text for a youtube embedded <iframe></iframe> and wrap in a <div classname="youtube-embed-container"></div>
    // - Parse the original Markdown text for a twitter embedded <blockquote class="twitter-tweet"> and replace with <blockquote class="twitter-tweet tw-align-center">
    function ParseMarkdownHTML(post) {
        let BlogPostBody = String(post.attributes.BlogPostBody);
        let embeddedTweetExists = false;
        let openIndex = 0;
        let closeIndex = 0;
        let stringInsert = ``;

        // Iterate through each character searching for < tags. Solve each edge case
        for (let i = 0; i < BlogPostBody.length; i++) {
            
            // Case: Twitter Embedded Tweet
            if (BlogPostBody[i] === "<" && i + 34 < BlogPostBody.length && BlogPostBody.substring(i, i + 34) === `<blockquote class="twitter-tweet">`) {
                // Let's flag that we've found an embedded tweet so we can preload the twitter widget
                if (!embeddedTweetExists) {
                    embeddedTweetExists = true;
                }
                openIndex = i; // i must be the opening of a twitter embedded <blockquote></blockquote> tag
                closeIndex = i + 34;
                stringInsert = `<blockquote class="twitter-tweet tw-align-center">`;

                // Apply the tw-align-center class to the embedded tweet
                BlogPostBody = BlogPostBody.substring(0, openIndex) + stringInsert + BlogPostBody.substring(closeIndex);
                i = openIndex + stringInsert.length - 1; // Go to end of our string insertion and continue iterating
                continue;
            }

            // Case: Youtube Embedded Video
            else if (BlogPostBody[i] === "<" && i + 7 < BlogPostBody.length && BlogPostBody.substring(i, i + 7) === "<iframe" && BlogPostBody.substring(i - 41, i) != `<div classname="youtube-embed-container">`) {
                openIndex = i; // i must be the opening of an <iframe></iframe> tag
                i += 7; // Skip forwards
                // Check to find either closing > or 'youtube.com' | 
                while (BlogPostBody[i] != ">" && i + 1 < BlogPostBody.length) {
                    i++;
                    // If 'youtube.com' in <iframe> tag, then fetch close of iframe
                    if (BlogPostBody[i] === "y" && i + 17 < BlogPostBody.length && BlogPostBody.substring(i, i + 17) === "youtube.com/embed") {
                        let j = i + 17; // Skip forwards
                        while (j + 1 < BlogPostBody.length && BlogPostBody.substring(j - 9, j + 1) != "></iframe>") {
                            j++;
                        }
                        // We've exited while loop, check if we found found closing </iframe> tag and apply <div classname="youtube-embed-container"></div>
                        if (BlogPostBody.substring(j - 9, j + 1) === "></iframe>") {
                            closeIndex = j + 1;
                            stringInsert = `<div classname="youtube-embed-container">${BlogPostBody.substring(openIndex, closeIndex)}</div>`;
                            BlogPostBody = BlogPostBody.substring(0, openIndex) + stringInsert + BlogPostBody.substring(closeIndex);
                            i = openIndex + stringInsert.length - 1; // Go to end of our string insertion and continue iterating
                            break;
                        }
                    }
                }
                continue;
            }
        }
        // Return original or new BlogPostBody and if an embedded tweet exists to handle twitter widget script
        return { BlogPostBody, embeddedTweetExists };
    }
    const { BlogPostBody: BlogPostBody, embeddedTweetExists } = ParseMarkdownHTML(post);

    // Generate HTML component with React Markdown library | rehypeRaw allows the use of Raw HTML in the Markdown text, and CustomImage will optimize Cloudinary Images with Next <Image/> tags
    let BlogPostBodyComponent = <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: CustomImage}}>{BlogPostBody}</Markdown>;
    
    // Return a Date() object as yyyy-mm-dd
    function formatDate(date) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        // Preload Twitter Widget for embedded tweets
        const loadTwitterWidgetScript = () => {
            const script = document.createElement('script');
            script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
            script.setAttribute('async', 'true');

            // Wait for the script to be fully loaded, then append it to the document head
            script.onload = () => {
                // Ensure the DOM is ready before calling load()
                document.addEventListener('DOMContentLoaded', () => {
                    window.twttr.widgets.load(document.getElementById("slug-body"));
                });
            };
            document.head.appendChild(script);
        };
        // Check if we need to preload the twitter widget and handle accordingly
        const checkAndLoadTwitterWidget = () => {
            // Load Twitter widget script only if we found an embedded tweet in the body of this blog post
            if (embeddedTweetExists === true) {
                // If we don't have the twitter widget defined, then preload the widget
                if (!window.twttr) {
                    loadTwitterWidgetScript();
                } else { // We do have the twitter widget defined, run it
                    window.twttr.widgets.load(document.getElementById("slug-body"));
                }
            }
        };

        // Check and load Twitter widget script on initial component mount
        checkAndLoadTwitterWidget();

        // Clean up: Remove any event listeners when component unmounts
        return () => {};
    }, [embeddedTweetExists]);

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
                            <p>{blogPostReadLengthText(post, readWPM)}</p>
                        </div>
                        <Image className='slug-page-image'
                            src={`${post.attributes.SPLASH.data.attributes.url}`}
                            alt={post.attributes.Title}
                            width={800}
                            height={600}
                        />
                        <div id='slug-body' className='slug-page-body'>
                            {BlogPostBodyComponent}
                        </div>
                    </main>
                </DefaultLayout>
            </div>
        </>
    );
}