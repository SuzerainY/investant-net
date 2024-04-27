import { STRAPIurl, customImage } from '@/my_modules/bloghelp';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DefaultLayout from '@/layouts/DefaultLayout';

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
                HavenProfilePicture {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                RyanDescription
                RyanProfilePicture {
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
      `
    })
  }
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
}

export default function AboutUs(props) {

  const [havenDescription, setHavenDescription] = useState(null);
  const [ryanDescription, setRyanDescription] = useState(null);
  const [havenProfilePictureURL, setHavenProfilePictureURL] = useState(null);
  const [ryanProfilePictureURL, setRyanProfilePictureURL] = useState(null);

  useEffect(() => {
    setHavenDescription(props.data.aboutUsPage.data.attributes.HavenDescription);
    setRyanDescription(props.data.aboutUsPage.data.attributes.RyanDescription);
    setHavenProfilePictureURL(props.data.aboutUsPage.data.attributes.HavenProfilePicture.data.attributes.url);
    setRyanProfilePictureURL(props.data.aboutUsPage.data.attributes.RyanProfilePicture.data.attributes.url);
  }, [
    props.data.aboutUsPage.data.attributes.HavenDescription,
    props.data.aboutUsPage.data.attributes.RyanDescription,
    props.data.aboutUsPage.data.attributes.HavenProfilePicture,
    props.data.aboutUsPage.data.attributes.RyanProfilePicture
  ]);


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

      <DefaultLayout>
        <div className="aboutuspage">
          <div className="about-us-page-wrapper">
            <div className="about-us-page-title-container">
              <div className="about-us-page-title">
                <h1>The Investant Team</h1>
                <div className="about-us-page-title-divider">
                  <h3>{"Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy."}</h3>
                </div>
              </div>
            </div>
            <div className="about-us-profile-container">
              {(havenDescription != null) && (
                <div className="about-us-profile">
                  <div className="about-us-profile-image">
                    <Link href="https://www.linkedin.com/in/haven-smith/" target="_blank" rel="noopener noreferrer">
                      <Image
                        src={havenProfilePictureURL}
                        alt={"havenProfilePicture"}
                        priority={true}
                        width={200}
                        height={200}
                      />
                    </Link>
                  </div>
                  <div className="about-us-profile-description">
                    <h2>Haven Smith</h2>
                    <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{havenDescription}</Markdown>
                  </div>
                </div>
              )}
              {(ryanDescription != null) && (
                <div className="about-us-profile">
                  <div className="about-us-profile-image">
                    <Link href="https://www.linkedin.com/in/ryanrw/" target="_blank" rel="noopener noreferrer">
                      <Image
                        className="about-us-profile-image"
                        src={ryanProfilePictureURL}
                        alt={"ryanProfilePicture"}
                        priority={true}
                        width={200}
                        height={200}
                      />
                    </Link>
                  </div>
                  <div className="about-us-profile-description">
                    <h2>Ryan White</h2>
                    <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{ryanDescription}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  )
}