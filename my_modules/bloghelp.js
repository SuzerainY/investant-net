// The methods in this module are used to aid the blog pages and some blog functionality of investant.net
import Image from 'next/image';

// The URL for our STRAPI app backend stored in environment variables
export const STRAPIurl = process.env.NEXT_PUBLIC_STRAPIBASEURL;

// Custom component to conditionally render Cloudinary images as Next.js Image components
export const customImage = ({ alt, src }) => {
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
        return <img alt={alt || ''} src={src}/>; // Return the original <img/>
    }
};

// This function takes a blog post and our assumption for WPM the average reader reads to calculate approximately how long it will take to read the post 
export const blogPostReadLengthText = (post) => {
    const readWPM = 200; // Assumption for how many words per minute the average reader can read
    const blogPostBody = post.attributes.BlogPostBody;
    let spaceCount = 0;

    // Count the number of spaces in blog body
    for (let i = 0; i < blogPostBody.length; i++) {if (blogPostBody[i] === " ") {spaceCount++;}}
    const blogPostTimeToRead = Math.ceil(spaceCount / readWPM);

    // If it only takes 1 minute to read, return "minute", else we'll return "minutes" below
    if (blogPostTimeToRead === 1 || blogPostTimeToRead === 0) {
        return '~ 1 minute'
    } else {
        return `~ ${blogPostTimeToRead} minutes`
    }
};

// Return a Date() object as 'February 30, 2023'
export const formatDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = date.getUTCFullYear();
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    
    return `${month} ${day}, ${year}`;
}

// We need to parse the HTML of our Blog Posts and handle for edge cases:
// - Parse the original Markdown text for a twitter embedded <blockquote class="twitter-tweet"> and replace with <blockquote class="twitter-tweet tw-align-center">
// - Parse the original Markdown text for a youtube embedded <iframe></iframe> and wrap in a <div classname="youtube-embed-container"></div>
export function parseMarkdownHTML(post) {
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
            if (!embeddedTweetExists) {embeddedTweetExists = true;}

            openIndex = i; // i must be the opening of a twitter embedded <blockquote></blockquote> tag
            closeIndex = i + 34;
            stringInsert = `<blockquote class="twitter-tweet tw-align-center">`;

            // Apply the tw-align-center class to the embedded tweet
            BlogPostBody = BlogPostBody.substring(0, openIndex) + stringInsert + BlogPostBody.substring(closeIndex);
            i = openIndex + stringInsert.length - 1; // Go to end of our string insertion and continue iterating
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
                    while (j + 1 < BlogPostBody.length && BlogPostBody.substring(j - 9, j + 1) != "></iframe>") {j++;}

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
        }
    }
    // Return original or new BlogPostBody and if an embedded tweet exists to handle twitter widget script
    return { BlogPostBody, embeddedTweetExists };
}