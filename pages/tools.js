import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultLayout from '@/layouts/DefaultLayout';
import InvestantSavingsCalculator from '@/components/InvestantSavingsCalculator/InvestantSavingsCalculator';

export default function Tools() {
    const router = useRouter();

    const investantSavingsCalculator = useRef(null);

    useEffect(() => {
        const handleBlockOnLoad = () => {
            if (router.isReady && router.query.block === 'SavingsCalculator') {
                investantSavingsCalculator.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }; handleBlockOnLoad();
      }, [router.isReady, router.query.block]);

    return (
        <>
            <Head>
                <title>Investant | Tools</title>
                <meta name="description" content="Investant is committed to the development of tools for your financial growth." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Investant | Tools" />
                <meta name="twitter:description" content="Investant is committed to the development of tools for your financial growth." />
                <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content="Investant | Tools" />
                <meta property="og:description" content="Investant is committed to the development of tools for your financial growth." />
                <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
                <meta property="og:url" content="https://investant.net/tools" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <main className='toolspage'>
                    <section className="toolspage-title-section">
                        <div className="toolspage-title-section-text-container">
                            <div className="toolspage-title-section-title">
                                <h1><span className="toolspage-title-section-title-span">Investant</span> Tools</h1>
                            </div>
                            <div className="toolspage-title-section-subtitle">
                                <p>{`We'll`} provide tools for <span className="toolspage-title-section-subtitle-span">your</span> financial growth.</p>
                            </div>
                        </div>
                    </section>

                    <section ref={investantSavingsCalculator} className='investant-savings-calculator'>
                        <InvestantSavingsCalculator />
                    </section>
                </main>
            </DefaultLayout>
        </>
    );
};