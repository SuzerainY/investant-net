import { useInvestantUserAuth } from '@/context/GlobalContext';
import { STRAPIurl } from '@/my_modules/bloghelp';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidEmail, isValidText } from '@/my_modules/authenticationhelp';
import { useEffect, useState } from 'react';
import DefaultLayout from '@/layouts/DefaultLayout';
import Head from 'next/head';

export default function ContactUs() {
    const { username, userEmail, userSignedIn } = useInvestantUserAuth();

    // Error and Info to be used in form messages
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Handle the Contact Us form
    const [contactUsName, setContactUsName] = useState('');
    const [contactUsEmail, setContactUsEmail] = useState('');
    const [contactUsSubject, setContactUsSubject] = useState('');
    const [contactUsMessage, setContactUsMessage] = useState('');

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
        const googleRecaptchaScript = document.createElement('script');
        googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
        googleRecaptchaScript.async = true;
        googleRecaptchaScript.defer = true;
        document.body.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    useEffect(() => {
        const verifySignIn = () => {
            if (userSignedIn !== undefined && userSignedIn === true) {
                if (username) {setContactUsName(username);}
                if (userEmail) {setContactUsEmail(userEmail);}
            }
        }; verifySignIn();
    }, [userSignedIn, username, userEmail]);

    const handleContactUsSubmission = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');
    
        if (contactUsEmail.length <= 0 || contactUsSubject.length <= 0 || contactUsMessage.length <= 0) {
            setError('Form Incomplete');
            return;
        }
        if (isValidEmail(contactUsEmail) === false) {
            setError('Invalid Email Address');
            return;
        }
        if (isValidText(contactUsSubject) === false) {
            setError('Invalid Subject. Please Do Not Use Any Angle Brackets <> Or Backticks `');
            return;
        }
        if (isValidText(contactUsMessage) === false) {
            setError('Invalid Message. Please Do Not Use Any Angle Brackets <> Or Backticks `');
            return;
        }
    
        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Contact_Us_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Try Again Later.');
                        return;
                    }
                        
                    const response = await fetch(`${STRAPIurl}/api/contact-us-submissions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: {
                                Subject: contactUsSubject,
                                Message: contactUsMessage,
                                OpenedAt: new Date().toISOString(),
                                ContactName: contactUsName,
                                ContactEmail: contactUsEmail,
                                TicketClosed: false
                            }
                        })
                    });
            
                    if (!response.ok) {
                        // Handle Known Errors
                        throw new Error('Unaccounted For Error Occurred.');
                    }
                    setInfo('Message Delivered! Haven Or Ryan Will Reach Out To You As Soon As Possible!');
                } catch (error) {setError('Unable To Deliver Message. Please Try Again Later.');}
            });
        });
    };

    return (
        <>
            <Head>
                <title>Investant | Contact Us</title>
                <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Investant | Contact Us" />
                <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content="Investant | Contact Us" />
                <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
                <meta property="og:url" content="https://investant.net/contact-us" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <main>
                    <section id="contact-us-form-section" className="account-page-container" style={{flexDirection: 'column'}}>
                        <div className="account-page-forms-section">
                            <div className="account-page-form-container">
                                <div className="account-page-form-title">
                                    <h1>Contact Us</h1>
                                </div>
                                <form className="account-page-form-body" onSubmit={handleContactUsSubmission}>
                                    {(userSignedIn !== true) && (
                                        <>
                                            <div className="account-page-form-body-row">
                                                <label className="account-page-form-body-row-label" htmlFor="contactUsName">Your Name</label>
                                                <input
                                                    className="account-page-form-body-row-input"
                                                    type="username"
                                                    autoComplete="off"
                                                    id="contactUsName"
                                                    placeholder="Who Are We Speaking To?"
                                                    value={contactUsName}
                                                    onChange={(e) => setContactUsName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="account-page-form-body-row">
                                                <label className="account-page-form-body-row-label" htmlFor="contactUsEmail">Your Email</label>
                                                <input
                                                    className="account-page-form-body-row-input"
                                                    type="email"
                                                    autoComplete="off"
                                                    id="contactUsEmail"
                                                    placeholder="How Can We Contact You?"
                                                    value={contactUsEmail}
                                                    onChange={(e) => setContactUsEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="account-page-form-body-row">
                                        <label className="account-page-form-body-row-label" htmlFor="contactUsSubject">Subject  <span style={{fontSize: '14px', color: '#D3D3D3'}}>{`(${100 - contactUsSubject.length} characters remaining)`}</span></label>
                                        <input
                                            className="account-page-form-body-row-input"
                                            type="text"
                                            autoComplete="off"
                                            id="contactUsSubject"
                                            maxLength={100}
                                            placeholder={`What's the topic?`}
                                            value={contactUsSubject}
                                            onChange={(e) => setContactUsSubject(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <label className="account-page-form-body-row-label" htmlFor="contactUsMessage">Message <span style={{fontSize: '14px', color: '#D3D3D3'}}>{`(${2500 - contactUsMessage.length} characters remaining)`}</span></label>
                                        <textarea
                                            className="account-page-form-body-row-input"
                                            style={{resize: 'vertical', minHeight: '43px'}}
                                            id="contactUsMessage"
                                            rows={5}
                                            maxLength={2500}
                                            placeholder="What can we help you with?"
                                            value={contactUsMessage}
                                            onChange={(e) => setContactUsMessage(e.target.value)}
                                            required
                                        />
                                    </div>                  
                                    <div className="account-page-form-body-row">
                                        {error && <p className="account-page-form-body-row-error-message">{error}</p>}
                                        {info && <p className="account-page-form-body-row-info-message">{info}</p>}
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <button type="submit" className="account-page-form-body-row-button">
                                            <p>Send</p>
                                        </button>
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