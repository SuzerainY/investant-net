import Head from 'next/head';
import DefaultLayout from '@/layouts/DefaultLayout';
import Image from 'next/image';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useState, useEffect } from 'react';

const STRAPIurl = process.env.NEXT_PUBLIC_STRAPIBASEURL;

export async function getServerSideProps(context) {
  // Fetch 15 most recent posts for inital page render
  const fetchParams = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query GetAboutUsPage {
          aboutUsPage {
            data {
              id
              attributes {
                HavenDescription
                RyanDescription
              }
            }
          }
        }
      `
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

export default function AboutUs(props) {

  const [havenDescription, setHavenDescription] = useState(null);
  const [ryanDescription, setRyanDescription] = useState(null);

  useEffect(() => {
    setHavenDescription(props.data.aboutUsPage.data.attributes.HavenDescription);
    setRyanDescription(props.data.aboutUsPage.data.attributes.RyanDescription);
  }, [props.data.aboutUsPage.data.attributes.HavenDescription, props.data.aboutUsPage.data.attributes.RyanDescription]);


  return (
    <>
      <Head>
        <title>Investant | About Us</title>
        <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investant | Financial Tools, Literacy, & Education" />
        <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

        {/* Open Graph Meta Tags (for platforms like Facebook) */}
        <meta property="og:title" content="Investant | Financial Tools, Literacy, & Education" />
        <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
        <meta property="og:url" content="https://investant.net" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Investant" />

        {/* Favicon */}
        <link rel="icon" href="/images/branding/FaviconTransparent.png" />
      </Head>

      <div class="aboutuspage">
        <DefaultLayout>
          <div className="about-us-page-title">
            <h1>Our Creators</h1>
          </div>
          <div className="about-us-profile-container">
          {havenDescription && (
              <div className="about-us-profile">
                <div className="about-us-profile-image">
                  <Image
                    src={"/images/profilepictures/havenProfile.jpg"}
                    alt={"havenProfilePicture"}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="about-us-profile-description">
                  <h2>Haven Smith</h2>
                  <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: CustomImage}}>
                    {havenDescription}
                  </Markdown>
                </div>
              </div>
            )}
            {ryanDescription && (
              <div className="about-us-profile">
                <div className="about-us-profile-image">
                  <Image
                    className="about-us-profile-image"
                    src={"/images/profilepictures/ryanProfile.jpg"}
                    alt={"ryanProfilePicture"}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="about-us-profile-description">
                  <h2>Ryan White</h2>
                  <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: CustomImage}}>
                    {ryanDescription}
                  </Markdown>
                </div>
              </div>
            )}
          </div>
        </DefaultLayout>
      </div>
    </>
  )
}