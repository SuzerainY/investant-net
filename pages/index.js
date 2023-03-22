import Head from "next/head";
import Image from "next/image";
import DefaultLayout from "@/layouts/DefaultLayout";
import OfficeWorker from "/public/images/clipart/ClipArtOfficeWorker.svg";
import AlertBanner from "@/components/AlertBanner/AlertBanner";
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
          link={"https://discord.gg/SFUKKjWEjH"}
          linkMessage={" Click here to join!"}
        />
        <DefaultLayout>
          <section className="hero-section">
            <div className="hero-text-container">
              <text>
                An investment
                <br />
                community
                <br />
                <span className="hero-text--span">made for you.</span>
              </text>
            </div>

            <div className="hero-image-container">
              <Image src={OfficeWorker} alt="Office Worker ClipArt" fill />
            </div>
          </section>
        </DefaultLayout>
      </div>
    </>
  );
}
