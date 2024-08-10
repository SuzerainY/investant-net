import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const publisherID = process.env.NEXT_PUBLIC_GOOGLE_AD_SENSE_PUBLISHER_ID;

  return (
    <Html lang="en">
      <Head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherID}`}
          crossOrigin='anonymous'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};