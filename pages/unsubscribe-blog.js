import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidEmail } from '@/my_modules/authenticationhelp';
import { STRAPIurl } from '@/my_modules/bloghelp';
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Error() {

    const [email, setEmail] = useState('');

    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
            const googleRecaptchaScript = document.createElement('script');
            googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
            googleRecaptchaScript.async = true;
            googleRecaptchaScript.defer = true;
            document.body.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    const unsubscribeEmail = (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        if (isValidEmail(email) === false) {
            setError('Invalid Email Address');
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Public_Unsubscribe_Email_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/public-blog-subscriber/unsubscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email
                        })
                    });
                    const data = await response.json();
    
                    if (!response.ok) {
                        // Handle Known Errors
                        if (data.message === 'Email Not Provided In Request Body') {
                            setError('Request Failure. Please Contact Us If The Issue Persists.');
                            return;
                        } else if (data.message === 'Email Is Not A Current Subscriber') {
                            setError('This Email Is Not A Subscriber.');
                            return;
                        }
                        throw new Error('Unaccounted For Error Occurred.');
                    }
                    setInfo('Successfully Unsubscribed!');
                } catch (error) {setError('Unable To Unsubscribe. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    return (
        <>
            <Head>
                <title>Investant | Unsubscribe Blog</title>
                <meta name="description" content="Unsubscribe From The Investant Blog" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Investant | Unsubscribe Blog" />
                <meta name="twitter:description" content="Unsubscribe From The Investant Blog" />
                <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content="Investant | Unsubscribe Blog" />
                <meta property="og:description" content="Unsubscribe From The Investant Blog" />
                <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
                <meta property="og:url" content="https://investant.net/unsubscribe-blog" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <main>
                    <section className="account-page-container" style={{flexDirection: 'column'}}>
                        <div className="account-page-forms-section">
                            <div className="account-page-form-container">
                                <div className="account-page-form-title">
                                    <h1>Unsubscribe | Investant Blog</h1>
                                </div>
                                <form className="account-page-form-body" onSubmit={unsubscribeEmail}>
                                    <div className="account-page-form-body-row">
                                        <label className="account-page-form-body-row-label" htmlFor="emailInput">
                                            <p>Email</p>
                                        </label>
                                        <input
                                            className="account-page-form-body-row-input"
                                            id="emailInput"
                                            type="email"
                                            autoComplete="off"
                                            value={email}
                                            placeholder="email@example.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <button className="account-page-form-body-row-button" type="submit">
                                            <p>Unsubscribe</p>
                                        </button>
                                    </div>
                                    <div className="account-page-form-body-row">
                                        {info && (
                                            <p className="account-page-form-body-row-info-message">{info}</p>
                                        )}
                                        {error && (
                                            <p className="account-page-form-body-row-error-message">{error}</p>
                                        )}
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <p>Having Issues? <Link href={'/contact-us'} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#E81CFF' }}>Please Contact Us</Link></p>
                                    </div>
                                </form>
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