import Script from 'next/script';

export default function GoogleAdSense() {

    const publisherID = process.env.NEXT_PUBLIC_GOOGLE_AD_SENSE_PUBLISHER_ID;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherID}`}
            crossOrigin='anonymous'
            strategy='afterInteractive'
        />
    );
};