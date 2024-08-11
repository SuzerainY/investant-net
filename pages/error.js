import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Error() {
    const router = useRouter();

    // Error Birthed As Generic
    const [errorType, setErrorType] = useState('Generic');

    // List of potential error types
    const errorTypes = [
        'Generic',
        'EmailVerification'
    ];

    // Fetch Potential Error Name From Query
    useEffect(() => {
        const determineError = () => {
            if (router.isReady && router.query.type) {
                if (errorTypes.includes(router.query.type)) {
                    setErrorType(router.query.type);
                }
            }
        }; determineError();
    }, [router.isReady, router.query.type]);

    return (
        <>
            <Head>
                <title>Investant | Error</title>
                <meta name="description" content="Investant Error: Oops!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Investant | Error" />
                <meta name="twitter:description" content="Investant Error: Oops!" />
                <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content="Investant | Error" />
                <meta property="og:description" content="Investant Error: Oops!" />
                <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
                <meta property="og:url" content="https://investant.net/error" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <main>
                    <section id="error-form-section" className="account-page-container" style={{flexDirection: 'column'}}>
                        <div className="account-page-forms-section">
                            <div className="account-page-form-container">
                                <div className="account-page-form-title">
                                    <h1>Investant Error...</h1>
                                </div>
                                <div className="account-page-form-body">
                                    <div className="account-page-form-body-row">
                                        {((errorType === 'Generic') || (errorTypes.includes(errorType) !== true)) && (
                                            <p className="account-page-form-body-row-error-message">Oops! There Was An Error.</p>
                                        )}
                                        {(errorType === 'EmailVerification') && (
                                            <p className="account-page-form-body-row-error-message">There Was An Issue Verifying Your Email. The Link Could Have Had A Bad Token Or Our Server May Have Failed.</p>
                                        )}
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <p>Having Issues? <Link href={'/contact-us'} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#E81CFF' }}>Please Contact Us</Link></p>
                                    </div>
                                </div>
                            </div>
                            <div className="account-page-google-recaptcha-disclaimer-tag">
                                <p>
                                    This site is protected by reCAPTCHA and the Google
                                    <a href="https://policies.google.com/privacy"> Privacy Policy</a> and
                                    <a href="https://policies.google.com/terms"> Terms of Service</a> apply.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </DefaultLayout>
        </>
    );
};