import Header from '@/components/header.js';
import HomeImage from '@/components/homeImage.js';
import Head from 'next/head';
import HomeBody from '@/components/homeBody.js';
import Footer from '@/components/footer.js';

export default function Home() {
  return (
    <>
      <div>
        <Head>
          <title>Investant | Financial Tools, Literacy, & Education</title>
          <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy."/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="twitter:image" content="images/branding/TransparentLogo.svg"/>
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="icon" href="images/branding/FaviconTransparent.png" />
        </Head>
        <Header/>
        <HomeImage/>
        <HomeBody/>
        <Footer/>
      </div>
    </>
  )
}