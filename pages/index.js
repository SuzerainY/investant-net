// import Header from "@/components/header.js";
import Header from "@/components/Header/Header.js";
import HomeImage from "@/components/homeImage.js";
import Head from "next/head";
import HomeBody from "@/components/homeBody.js";
import Footer from "@/components/footer.js";
import DefaultLayout from "@/layouts/DefaultLayout";
import Image from "next/image";
import OfficeWorker from "/public/images/clipart/ClipArtOfficeWorker.svg";
import AlertBanner from "@/components/AlertBanner.js/AlertBanner";
export default function Home() {
  return (
    <>
      <Head>
        <title>Investant | Financial Tools, Literacy, & Education</title>
        <meta
          name="twitter:description"
          content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="twitter:image"
          content="images/branding/TransparentLogo.svg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="images/branding/FaviconTransparent.png" />
      </Head>

      <div className="homepage">
        <AlertBanner
          message={"PaperTrade Available NOW in the Investant Discord Server!"}
          link={"https://discord.gg/SFUKKjWEjHs"}
          linkMessage={" Click here to join!"}
        />
        <DefaultLayout>
          <section className="hero-section">
            <div className="hero-text-container">
              <h1>
                An investment
                <br />
                community
                <br />
                <span className="hero-text--span">made for you.</span>
              </h1>
            </div>

            <div className="hero-image-container">
              <Image src={OfficeWorker} alt="Office Worker ClipArt" fill />
            </div>
          </section>
        </DefaultLayout>
      </div>

      {/* <HomeImage />
        <HomeBody />
        <Footer /> */}
    </>
  );
}
