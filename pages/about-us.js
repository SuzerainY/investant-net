import { STRAPIurl, customImage, parseMarkdownHTML } from '@/my_modules/bloghelp';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DefaultLayout from '@/layouts/DefaultLayout';

export async function getServerSideProps(context) {
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
                CompanyDescription
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
  };
  const res = await fetch(`${STRAPIurl}/graphql`, fetchParams);
  const data = await res.json();
  return { props: data };
};

export default function AboutUs(props) {

  const [companyDescription, setCompanyDescription] = useState(null);
  const [havenDescription, setHavenDescription] = useState(null);
  const [ryanDescription, setRyanDescription] = useState(null);
  const [havenProfilePictureURL, setHavenProfilePictureURL] = useState(null);
  const [ryanProfilePictureURL, setRyanProfilePictureURL] = useState(null);

  useEffect(() => {
    setCompanyDescription(parseMarkdownHTML(props.data.aboutUsPage.data.attributes.CompanyDescription).textBody);
    setHavenDescription(parseMarkdownHTML(props.data.aboutUsPage.data.attributes.HavenDescription).textBody);
    setRyanDescription(parseMarkdownHTML(props.data.aboutUsPage.data.attributes.RyanDescription).textBody);
    setHavenProfilePictureURL(props.data.aboutUsPage.data.attributes.HavenProfilePicture.data.attributes.url);
    setRyanProfilePictureURL(props.data.aboutUsPage.data.attributes.RyanProfilePicture.data.attributes.url);
  }, [
    props.data.aboutUsPage.data.attributes.CompanyDescription,
    props.data.aboutUsPage.data.attributes.HavenDescription,
    props.data.aboutUsPage.data.attributes.RyanDescription,
    props.data.aboutUsPage.data.attributes.HavenProfilePicture,
    props.data.aboutUsPage.data.attributes.RyanProfilePicture
  ]);

  return (
    <>
      <Head>
        <title>Investant | About</title>
        <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investant | About" />
        <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

        {/* Open Graph Meta Tags (for platforms like Facebook) */}
        <meta property="og:title" content="Investant | About" />
        <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
        <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
        <meta property="og:url" content="https://investant.net/about-us" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Investant" />

        {/* Favicon */}
        <link rel="icon" href="/images/branding/FaviconTransparent.png" />
      </Head>

      <DefaultLayout>
        <main className="about-us-page">

          <section className="about-us-page-title-section">
            <div className="about-us-page-title-section-text-container">
              <div className="about-us-page-title-section-title">
                <h1>Navigate <span className="about-us-page-title-section-title-span">Your</span> Financial Journey With <span className="about-us-page-title-section-title-span">Confidence</span></h1>
              </div>
              <div className="about-us-page-title-section-subtitle">
                <p>Welcome to <span className="about-us-page-title-section-subtitle-span">investant.net</span>, where financial literacy {`isn't`} a privilege, but a practical pursuit for everyone.</p>
              </div>
            </div>
          </section>

          <section className="about-us-page-company-description-section">
            <div className="about-us-page-company-description-section-text-container">
              <div className="about-us-page-company-description-section-title">
                <h2>Transforming <span className="about-us-page-company-description-section-title-span">Personal Finance</span> for New Professionals</h2>
              </div>
              <div className="about-us-page-company-description-section-subtitle">
                {(companyDescription) ? (
                  <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{companyDescription}</Markdown>
                ) : (
                <p>At <span className="about-us-page-company-description-section-subtitle-span">investant.net</span>, {`we're`} dedicated to providing new professionals with the tools and information they need to take control of their personal finances. Our mission is to empower individuals to make smart financial decisions and achieve their financial goals.</p>
                )}
              </div>
              <Link href={'/contact-us'} className="about-us-page-company-description-section-button">
                <h4>Contact Us</h4>
              </Link>
            </div>
            <div className="about-us-page-company-description-section-image-container">
              <Image
                src={"https://res.cloudinary.com/dnmr13rcg/image/upload/f_auto,q_auto/medium_credit_card_stock_photo_1_3b7da4e384"}
                alt={"Investant Cover Photo for Company Description"}
                priority={true}
                width={800}
                height={400}
              />
            </div>
          </section>

          <section className="about-us-page-meet-the-team-section">
            <div className="about-us-page-meet-the-team-section-title">
              <h2>Meet the Team!</h2>
            </div>
            {havenDescription && (
              <div className="about-us-page-meet-the-team-section-team-member">
                <div className="about-us-page-meet-the-team-section-team-member-photo-container">
                  <Link href="https://www.linkedin.com/in/haven-smith/" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={havenProfilePictureURL}
                      alt={"Haven Profile Picture"}
                      width={200}
                      height={200}
                    />
                  </Link>
                </div>
                <div className="about-us-page-meet-the-team-section-team-member-text-container">
                  <div className="about-us-page-meet-the-team-section-team-member-name">
                    <h3>Haven <span className="about-us-page-meet-the-team-section-team-member-name-span">Smith</span></h3>
                  </div>
                  <div className="about-us-page-meet-the-team-section-team-member-description">
                    <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{havenDescription}</Markdown>
                  </div>
                </div>
              </div>
            )}
            {ryanDescription && (
              <div className="about-us-page-meet-the-team-section-team-member">
                <div className="about-us-page-meet-the-team-section-team-member-photo-container">
                  <Link href="https://www.linkedin.com/in/ryanrw/" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={ryanProfilePictureURL}
                      alt={"Ryan Profile Picture"}
                      width={200}
                      height={200}
                    />
                  </Link>
                </div>
                <div className="about-us-page-meet-the-team-section-team-member-text-container">
                  <div className="about-us-page-meet-the-team-section-team-member-name">
                    <h3>Ryan <span className="about-us-page-meet-the-team-section-team-member-name-span">White</span></h3>
                  </div>
                  <div className="about-us-page-meet-the-team-section-team-member-description">
                    <Markdown className='html' rehypePlugins={[rehypeRaw]} components={{img: customImage}}>{ryanDescription}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </DefaultLayout>
    </>
  );
};