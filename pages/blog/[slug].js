import { STRAPIurl, customImage, blogPostReadLengthText, formatDate, parseMarkdownHTML } from '@/my_modules/bloghelp';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DefaultLayout from '@/layouts/DefaultLayout';

// Fetch the SLUG for the selected BlogPost in order to route the new URL properly
export async function getServerSidePaths() {
    const fetchParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                {
                    blogPosts {
                        data {
                            attributes {
                                SLUG
                            }
                        }
                    }
                }
            `
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

export default function BlogPost(props) {
    const router = useRouter();
    const post = props.data.blogPosts.data[0];

    const [BlogPostBody, setBlogPostBody] = useState(null);
    const [embeddedTweetExists, setEmbeddedTweetExists] = useState(false);

    useEffect(() => {
        const { BlogPostBody, embeddedTweetExists } = parseMarkdownHTML(post);
        setBlogPostBody(BlogPostBody);
        setEmbeddedTweetExists(embeddedTweetExists);
    }, [post]);

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
            if (embeddedTweetExists) {
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
                            <p>{blogPostReadLengthText(post)}</p>
                        </div>
                        <Image className='slug-page-image'
                            src={`${post.attributes.SPLASH.data.attributes.url}`}
                            alt={post.attributes.Title}
                            priority={true}
                            width={800}
                            height={600}
                        />
                        {BlogPostBody && (
                            <div id='slug-body' className='slug-page-body'>
                                <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{BlogPostBody}</Markdown>
                            </div>
                        )}
                    </main>
                </DefaultLayout>
            </div>
        </>
    )
}