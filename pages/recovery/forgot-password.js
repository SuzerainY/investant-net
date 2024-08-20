import { useEffect, useState } from 'react';
import Link from 'next/link';
import DefaultLayout from "@/layouts/DefaultLayout";
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidEmail } from "@/my_modules/authenticationhelp";
import { STRAPIurl } from '@/my_modules/bloghelp';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
            const googleRecaptchaScript = document.createElement('script');
            googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
            googleRecaptchaScript.async = true;
            googleRecaptchaScript.defer = true;
            document.body.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    const handleForgotPassword = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        // Check if string is a valid email format
        if (isValidEmail(email) === false) {
            setError("Invalid Email Address. If This Is Your Correct Email, Please Contact Us To Recover Your Account.");
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Forgot_Password_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/auth/forgot-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email
                        })
                    });
                    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

                    setInfo('Email Sent. Please Check Your Inbox To Rest Your Password. If You Cannot Find The Message, Try Your Spam Folder!');
                } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
            });
        });
    };
    
    return (
        <>
            <DefaultLayout>
                <div className="login-form-wrapper">
                    <section className="login-form-container">
                        <div className="login-form-title"><h1>Password Recovery</h1></div>
                        <form className="login-form" onSubmit={handleForgotPassword}>
                            <div className="login-form-row">
                                <label className="login-form-row-label" htmlFor="email">Email Address</label>
                                <input
                                    className="login-form-row-input"
                                    type="email"
                                    id="email"
                                    value={email}
                                    placeholder="email@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="login-form-error-message">{error}</p>}
                            {info && <p className="login-form-info-message">{info}</p>}
                            <button className="login-form-submit-button" type="submit"><p>Send Email</p></button>
                        </form>
                        <div className="login-form-footer">
                            <p>Hey! Good To Go?</p>
                            <div className="login-form-toggle-switch-container">
                                <Link href="/login">
                                    <p className="login-form-toggle-label">Login</p>
                                </Link>
                            </div>
                        </div>
                    </section>
                    <section className="login-page-google-recaptcha-disclaimer-tag">
                        <p>
                            This site is protected by reCAPTCHA and the Google
                            <a href="https://policies.google.com/privacy"> Privacy Policy</a> and
                            <a href="https://policies.google.com/terms"> Terms of Service</a> apply.
                        </p>
                    </section>
                </div>
            </DefaultLayout>
        </>
    );
};