import { STRAPIurl, customImage, blogPostReadLengthText, formatDate, parseMarkdownHTML } from '@/my_modules/bloghelp';
import HavenBMC from '@/components/BuyACoffee/HavenBMC';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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
    };
    const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
    const data = await res.json();
    const paths = data.data.blogPosts.data.map((post) => ({
        params: { slug: post.attributes.SLUG },
    }));
    return { paths, fallback: true };
};

// Fetch the selected blog from the server via graphql
export async function getServerSideProps({ params }) {
    const slug = params.slug;
    
    // First query: Get the current post
    const currentPostQuery = {
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
        variables: { slug }
    };
  
    const currentPostRes = await fetch(`${STRAPIurl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPostQuery)
    });
  
    const currentPostData = await currentPostRes.json();
    const currentPost = currentPostData.data.blogPosts.data[0];
  
    // Second query: Get adjacent posts
    const adjacentPostsQuery = {
        query: `
            query getAdjacentPosts($currentDate: Date!, $currentSlug: String!) {
                previousPost: blogPosts(
                    sort: "PublishDate:desc"
                    filters: { PublishDate: { lt: $currentDate }, SLUG: { ne: $currentSlug } }
                    pagination: { limit: 1 }
                ) {
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
                nextPost: blogPosts(
                    sort: "PublishDate:asc"
                    filters: { PublishDate: { gt: $currentDate }, SLUG: { ne: $currentSlug } }
                    pagination: { limit: 1 }
                ) {
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
        variables: { 
            currentDate: currentPost.attributes.PublishDate,
            currentSlug: currentPost.attributes.SLUG
        }
    };
  
    const adjacentPostsRes = await fetch(`${STRAPIurl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjacentPostsQuery)
    });
  
    const adjacentPostsData = await adjacentPostsRes.json();
  
    return { 
        props: {
            currentPost: currentPost,
            previousPostTemp: adjacentPostsData.data.previousPost.data[0] || null,
            nextPostTemp: adjacentPostsData.data.nextPost.data[0] || null
        }
    };
};

export default function BlogPost({ currentPost, previousPostTemp, nextPostTemp }) {
    const router = useRouter();

    const [BlogPostBody, setBlogPostBody] = useState(null);
    const [embeddedTweetExists, setEmbeddedTweetExists] = useState(false);

    useEffect(() => {
        const { textBody, embeddedTweetExists } = parseMarkdownHTML(currentPost.attributes.BlogPostBody);
        setBlogPostBody(textBody);
        setEmbeddedTweetExists(embeddedTweetExists);
    }, [currentPost]);

    const [nextPost, setNextPost] = useState(null);
    const [previousPost, setPreviousPost] = useState(null);
    useEffect(() => {
        setNextPost(nextPostTemp);
        setPreviousPost(previousPostTemp);
    }, [nextPostTemp, previousPostTemp]);

    /*useEffect(() => {
        let script;

        const checkAndLoadTwitterWidget = () => {
            if (embeddedTweetExists) {
                const loadTwitterWidgets = () => {
                    if (window.twttr) {
                        window.twttr.widgets.load(document.getElementById("blogpost-body"));
                    } else {
                        script = document.createElement('script');
                        script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
                        script.setAttribute('async', 'true');
                        script.onload = () => {
                            if (document.getElementById("blogpost-body")) {
                                window.twttr.widgets.load(document.getElementById("blogpost-body"));
                            }
                        };
                        document.head.appendChild(script);
                    }
                }; loadTwitterWidgets();
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndLoadTwitterWidget);
        } else {checkAndLoadTwitterWidget();}

        return () => {
            if (script) {document.head.removeChild(script);}
            document.removeEventListener('DOMContentLoaded', checkAndLoadTwitterWidget);
        };
    }, [embeddedTweetExists]);*/

    // Render a loading state while data is being fetched
    if (router.isFallback || !currentPost) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{`Investant | ${currentPost.attributes.Title}`}</title>
                <meta name="description" content={currentPost.attributes.BlogPostDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Investant | ${currentPost.attributes.Title}`} />
                <meta name="twitter:description" content={currentPost.attributes.BlogPostDescription} />
                <meta name="twitter:image" content={`${currentPost.attributes.SPLASH.data.attributes.url}`} />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content={`Investant | ${currentPost.attributes.Title}`} />
                <meta property="og:description" content={currentPost.attributes.BlogPostDescription} />
                <meta property="og:image" content={`${currentPost.attributes.SPLASH.data.attributes.url}`} />
                <meta property="og:url" content={`https://investant.net/blog/${currentPost.attributes.SLUG}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <div className='blogpost-header-container'>
                    <header className='blogpost-header'>
                        <div className='blogpost-header-content'>
                            <h1 className='blogpost-title'>{currentPost.attributes.Title}</h1>
                            <div className='blogpost-meta'>
                                <p><span className='blogpost-author'>{currentPost.attributes.Author}</span></p>
                                <p><span className='blogpost-date'>{formatDate(new Date(currentPost.attributes.PublishDate))}</span></p>
                            </div>
                            <div className='blogpost-read-time'>
                                <p>{blogPostReadLengthText(currentPost.attributes.BlogPostBody)}</p>
                            </div>
                        </div>
                    </header>
                </div>
                <div className='blogpost-content-wrapper'>
                    <article className='blogpost-container'>
                        <div className='blogpost-content'>
                            <Image 
                                className='blogpost-image'
                                src={`${currentPost.attributes.SPLASH.data.attributes.url}`}
                                alt={currentPost.attributes.Title}
                                priority={true}
                                width={800}
                                height={600}
                            />
                            {BlogPostBody && (
                                <div id='blogpost-body' className='blogpost-body'>
                                    <Markdown 
                                        className='markdown-content' 
                                        rehypePlugins={[rehypeRaw]} 
                                        components={{img: customImage}}
                                    >
                                        {BlogPostBody}
                                    </Markdown>
                                </div>
                            )}
                        </div>
                    </article>
                    <aside className='blogpost-sidebar'>
                        <div className='blogpost-sidebar-content'>
                            <div className='blogpost-investant-product-container'>
                                <div className='blogpost-investant-product-content'>
                                    <h3>Take Control of Your Finances</h3>
                                    <p>Discover our powerful Financial Planner</p>
                                    <ul>
                                        <li>Create personalized budget plans</li>
                                        <li>Get insights for financial success</li>
                                        <li>Save and track your progress</li>
                                    </ul>
                                    <Link href="/products?block=FinancialPlanner" className="blogpost-investant-product-button">Start Planning Now</Link>
                                    <p className="blogpost-investant-product-footer">Investant.net - Your partner in financial growth</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                <div className="adjacent-posts">
                    {nextPost && (
                        <div>
                            <Link href={`/blog/${nextPost.attributes.SLUG}`}>
                                <div className="adjacent-post next-post">
                                    <Image 
                                        src={nextPost.attributes.SPLASH.data.attributes.url}
                                        alt={nextPost.attributes.Title}
                                        width={400}
                                        height={225}  // 16:9 aspect ratio
                                    />
                                    <div className="adjacent-post-text-container">
                                        <h2>{nextPost.attributes.Title}</h2>
                                        <p style={{paddingBottom: '10px'}}><span style={{color: '#2D64A9'}}>{nextPost.attributes.Author}</span> | {formatDate(new Date(nextPost.attributes.PublishDate))}</p>
                                        <div className="adjacent-post-description-container">
                                            <p>{nextPost.attributes.BlogPostDescription}</p>
                                        </div>
                                        <p className="adjacent-post-read-length">{blogPostReadLengthText(nextPost.attributes.BlogPostBody)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                    {previousPost && (
                        <div>
                            <Link href={`/blog/${previousPost.attributes.SLUG}`}>
                                <div className="adjacent-post previous-post">
                                    <Image 
                                        src={previousPost.attributes.SPLASH.data.attributes.url}
                                        alt={previousPost.attributes.Title}
                                        width={400}
                                        height={225}  // 16:9 aspect ratio
                                    />
                                    <div className="adjacent-post-text-container">
                                        <h2>{previousPost.attributes.Title}</h2>
                                        <p style={{paddingBottom: '10px'}}><span style={{color: '#2D64A9'}}>{previousPost.attributes.Author}</span> | {formatDate(new Date(previousPost.attributes.PublishDate))}</p>
                                        <div className="adjacent-post-description-container">
                                            <p>{previousPost.attributes.BlogPostDescription}</p>
                                        </div>
                                        <p className="adjacent-post-read-length">{blogPostReadLengthText(previousPost.attributes.BlogPostBody)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </DefaultLayout>

            {/* Buy Me A Coffee */}
            {currentPost.attributes.Author === 'Haven Smith' ? (
                <script
                    data-name="BMC-Widget"
                    data-cfasync="false"
                    src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
                    data-id="havensmith"
                    data-description="Support me on Buy me a coffee!"
                    data-message="Like the post? Buy Haven a coffee!"
                    data-color="#BD5FFF"
                    data-position="Right"
                    data-x_margin="18"
                    data-y_margin="18">
                </script>
                ) : currentPost.attributes.Author === 'Ryan White' ? (
                    <></>
                ) : <></>
            }
        </>
    );
};