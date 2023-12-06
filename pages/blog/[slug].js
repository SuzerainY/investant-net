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

    // This function takes a blog post and our assumption for WPM the average reader reads to calculate approximately how long it will take to read the post
    function blogPostReadLengthText(post, readWPM) {
        var spaceCount = 0;
        var blogPostBody = post.attributes.BlogPostBody;
        for (let i = 0; i < blogPostBody.length; i++) {
        if (blogPostBody[i] === " ") {
            spaceCount++;
        }
        }
        const blogPostTimeToRead = Math.ceil(spaceCount / readWPM);
        // If it only takes 1 minute to read, return "minute", else we'll return "minutes" below
        if (blogPostTimeToRead === 1) {
        return '~ 1 minute'
        } else {
        return `~ ${blogPostTimeToRead} minutes`
        }
    };

    // We need to parse the HTML and handle for edge cases:
    // - From outputted HTML via <Markdown></Markdown>, replace all <img/> tags with <Image/> tags so that Nextjs can optimize the delivery to client from cloudinary
    // - Parse the original Markdown text for a youtube embedded <iframe></iframe> and wrap in a <div classname="youtube-embed-container"></div>
    // - Parse the original Markdown text for a twitter embedded <blockquote class="twitter-tweet"> and replace with <blockquote class="twitter-tweet tw-align-center">
    function ParseMarkdownHTML(post) {
        var BlogPostBody = String(post.attributes.BlogPostBody);
        var embeddedTweetExists = false;

        function recursiveParse(BlogPostBody, embeddedTweetExists) {
            let BodyLength = BlogPostBody.length
            let openIndex = 0;
            let closeIndex = 0;
            let modified = false;

            // Iterate through each character searching for < tags. We will recursively solve for each edge case
            while (!modified) {

                for (let i = 0; i < BodyLength; i++) {
                    
                    // Case: Twitter Embedded Tweet
                    if (BlogPostBody[i] === "<" && i + 34 < BodyLength && BlogPostBody.substring(i, i + 34) === `<blockquote class="twitter-tweet">`) {
                        // Let's flag that we've found an embedded tweet so we can preload the twitter widget
                        if (!embeddedTweetExists) {
                            embeddedTweetExists = true;
                        }
                        openIndex = i; // i must be the opening of a twitter embedded <blockquote></blockquote> tag
                        closeIndex = i + 34;

                        // Apply the tw-align-center class to the embedded tweet
                        BlogPostBody = BlogPostBody.substring(0, openIndex) + `<blockquote class="twitter-tweet tw-align-center">` + BlogPostBody.substring(closeIndex);
                        modified = true;
                    }
                    // Case: Youtube Embedded Video
                    if (BlogPostBody[i] === "<" && i + 7 < BodyLength && BlogPostBody.substring(i, i + 7) === "<iframe" && BlogPostBody.substring(i - 41, i) != `<div classname="youtube-embed-container">`) {
                        openIndex = i; // i must be the opening of an <iframe></iframe> tag
                        i += 7; // Skip forwards
                        // Check to find either closing > or 'youtube.com' | 
                        while (BlogPostBody[i] != ">" && i + 1 < BodyLength) {
                            i++;
                            // If 'youtube.com' in <iframe> tag, then fetch close of iframe
                            if (BlogPostBody[i] === "y" && i + 17 < BodyLength && BlogPostBody.substring(i, i + 17) === "youtube.com/embed") {
                                j = i + 17; // Skip forwards
                                while (j + 1 < BodyLength && BlogPostBody.substring(j - 9, j + 1) != "></iframe>") {
                                    j++;
                                }
                                // We've exited while loop, check if we found found closing </iframe> tag and apply <div classname="youtube-embed-container"></div>
                                if (BlogPostBody.substring(j - 9, j + 1) === "></iframe>") {
                                    closeIndex = j + 1;
                                    BlogPostBody = BlogPostBody.substring(0, openIndex) + `<div classname="youtube-embed-container">${BlogPostBody.substring(openIndex, closeIndex)}</div>` + BlogPostBody.substring(closeIndex);
                                    console.log(BlogPostBody);
                                    modified = true;
                                }
                            }
                        }
                    }
                }
                break;
            }
            // If changes were made, reiterate with new changes
            if (modified) {
                return recursiveParse(BlogPostBody, embeddedTweetExists);
            }
            return { BlogPostBody, embeddedTweetExists }; // If no changes made, return original content
        }
        // var BlogPostBodyHTML = <Markdown className='html' rehypePlugins={[rehypeRaw]}>{recursiveParse(BlogPostBody)}</Markdown>;
        return recursiveParse(BlogPostBody, embeddedTweetExists);
    }
    const { BlogPostBody: BlogPostBody, embeddedTweetExists } = ParseMarkdownHTML(post);
    let BlogPostBodyComponent = <Markdown className='html' rehypePlugins={[rehypeRaw]}>{BlogPostBody}</Markdown>;

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

    useEffect(() => {
        const loadTwitterWidgetScript = () => {
            const script = document.createElement('script');
            script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
            script.setAttribute('async', 'true');
            document.head.appendChild(script);
        };

        const checkAndLoadTwitterWidget = () => {
            if (embeddedTweetExists) {
                // Load Twitter widget script if there are elements with '.twitter-tweet' class
                if (!window.twttr) {
                    loadTwitterWidgetScript();
                }
                window.twttr?.widgets.load();
            }
        };

        // Check and load Twitter widget script on route change
        router.events.on('routeChangeComplete', checkAndLoadTwitterWidget);

        // Check and load Twitter widget script on initial component mount
        checkAndLoadTwitterWidget();

        // Clean up: Remove event listener when component unmounts
        return () => {
            router.events.off('routeChangeComplete', checkAndLoadTwitterWidget);
        };
    }, [post, router.events]);

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
                        <div className='slug-page-body'>
                            {BlogPostBodyComponent}
                        </div>
                    </main>
                </DefaultLayout>
            </div>
        </>
    );
}