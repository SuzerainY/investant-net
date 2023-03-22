import Head from 'next/head';
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Investant | Blog</title>
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
        <DefaultLayout>
        </DefaultLayout>
      </div>
    </>
  )
}