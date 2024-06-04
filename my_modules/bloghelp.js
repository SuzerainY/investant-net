// The methods in this module are used to aid the blog pages and some blog functionality of investant.net
import Image from 'next/image';

// The URL for our STRAPI app backend stored in environment variables
export const STRAPIurl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

// Custom component to conditionally render Cloudinary images as Next.js Image components
export const customImage = ({ alt, src }) => {
    try {
        if (src.includes('https://res.cloudinary.com')) {
            return (
                <Image
                    alt={alt || ''}
                    src={src}
                    width={800}
                    height={600}
                />
            );
        }
        return <img alt={alt || ''} src={src}/>;
    } catch (error) {return <img alt={alt || ''} src={src}/>};
};

// This function takes a blog post and our assumption for WPM the average reader reads to calculate approximately how long it will take to read the post 
export const blogPostReadLengthText = (post) => {
    try {
        const readWPM = 200; // Assumption for how many words per minute the average reader can read
        let spaceCount = 0;
    
        for (let i = 0; i < post.length; i++) {if (post[i] === " ") {spaceCount++;}}
    
        const blogPostTimeToRead = Math.ceil(spaceCount / readWPM);
        if (blogPostTimeToRead === 1 || blogPostTimeToRead === 0) {return '~ 1 minute';}

        return `~ ${blogPostTimeToRead} minutes`;
    } catch (error) {return 'A Short Read'};
};

// Return a Date() object as 'February 30, 2023'
export const formatDate = (date) => {
    try {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const year = date.getUTCFullYear();
        const month = months[date.getUTCMonth()];
        const day = date.getUTCDate();
        
        return `${month} ${day}, ${year}`;
    } catch (error) {return 'September 16, 1387';}
};

// We need to parse the HTML of our Blog Posts and handle for edge cases:
// - Parse the original Markdown text for any "investant.net" and wrap in our investant-net-span class
// - Parse the original Markdown text for a twitter embedded <blockquote class="twitter-tweet"> and replace with <blockquote class="twitter-tweet tw-align-center">
// - Parse the original Markdown text for a youtube embedded <iframe></iframe> and wrap in a <div classname="youtube-embed-container"></div>
export const parseMarkdownHTML = (textBody) => {
    try {
        let embeddedTweetExists = false;
        let openIndex = 0;
        let closeIndex = 0;
        let stringInsert = '';
    
        // Iterate through each character searching for < tags. Solve each edge case
        for (let i = 0; i < textBody.length; i++) {
    
            // Case investant.net found (accent with magenta)
            if (textBody[i] === 'i' && i + 13 < textBody.length && textBody.substring(i, i + 13) === 'investant.net') {
                if (i - 8 >= 0 && textBody.substring(i - 8, i) === 'https://') {continue;}
                openIndex = i;
                closeIndex = i + 13;
                stringInsert = '<span className="investant-net-span">investant.net</span>';
    
                textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
                i = openIndex + stringInsert.length;
            }
            
            // Case: Twitter Embedded Tweet
            else if (textBody[i] === '<' && i + 34 < textBody.length && textBody.substring(i, i + 34) === '<blockquote class="twitter-tweet">') {
                // Let's flag that we've found an embedded tweet so we can preload the twitter widget
                if (embeddedTweetExists !== true) {embeddedTweetExists = true;}
    
                openIndex = i;
                closeIndex = i + 34;
                stringInsert = '<blockquote class="twitter-tweet tw-align-center">';
    
                // Apply the tw-align-center class to the embedded tweet
                textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
                i = openIndex + stringInsert.length - 1;
            }
    
            // Case: Youtube Embedded Video
            else if (textBody[i] === '<' && i + 7 < textBody.length && textBody.substring(i, i + 7) === '<iframe' && textBody.substring(i - 41, i) != '<div classname="youtube-embed-container">') {
                openIndex = i;
                i += 7;
    
                while (textBody[i] != '>' && i + 1 < textBody.length) {
                    i++;
                    // If 'youtube.com/embed' in <iframe> tag, then fetch close of iframe
                    if (textBody[i] === 'y' && i + 17 < textBody.length && textBody.substring(i, i + 17) === 'youtube.com/embed') {
                        let j = i + 17;
                        while (j + 1 < textBody.length && textBody.substring(j - 9, j + 1) != "></iframe>") {j++;}
    
                        // We've exited while loop, check if we found found closing </iframe> tag and apply <div classname="youtube-embed-container"></div>
                        if (textBody.substring(j - 9, j + 1) === '></iframe>') {
                            closeIndex = j + 1;
                            stringInsert = `<div classname="youtube-embed-container">${textBody.substring(openIndex, closeIndex)}</div>`;
                            textBody = textBody.substring(0, openIndex) + stringInsert + textBody.substring(closeIndex);
                            i = openIndex + stringInsert.length - 1;
                            break;
                        }
                    }
                }
            }
        }
        return { textBody, embeddedTweetExists };
    } catch (error) {const embeddedTweetExists = true; return { textBody, embeddedTweetExists };}
};