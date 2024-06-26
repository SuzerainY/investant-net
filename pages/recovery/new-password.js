import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DefaultLayout from "@/layouts/DefaultLayout";
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidPassword } from '@/my_modules/authenticationhelp';
import { STRAPIurl } from '@/my_modules/bloghelp';

export default function NewPassword() {

    const router = useRouter();
    const [userCode, setUserCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
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

    useEffect(() => {
        if (router.isReady) {
            const { code } = router.query;
            setUserCode(code);
        }
    }, [router.isReady, router.query]);

    const handleNewPassword = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');
        
        if (!userCode) {
            setError('Reset Code Is Missing. This Form Is For Email Password Recovery Only.');
            return;
        } else if (isValidPassword(newPassword) === false) {
            setError('Password Must Have No Spaces, Contain At Least 8 Characters, And Include 1 Special Character');
            return;
        } else if (newPassword !== confirmNewPassword) {
            setError('Your Passwords Do Not Match!');
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Forgot_Password_Set_New_Password_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/auth/reset-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: userCode,
                            password: newPassword,
                            passwordConfirmation: confirmNewPassword
                        })
                    });
                    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

                    setInfo('New Password Set! Feel Free To Leave This Page!');
                } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
            });
        });
    };
    
    return (
        <>
            <DefaultLayout>
                <div className="login-form-wrapper">
                    <section className="login-form-container">
                        <div className="login-form-title"><h1>Set New Password</h1></div>
                        <form className="login-form" onSubmit={handleNewPassword}>
                            <div className="login-form-row">
                                <label className="login-form-row-label" htmlFor="password">New Password</label>
                                <input
                                    className="login-form-row-input"
                                    type="password"
                                    id="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="login-form-row">
                                <label className="login-form-row-label" htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    className="login-form-row-input"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="login-form-error-message">{error}</p>}
                            {info && <p className="login-form-info-message">{info}</p>}
                            <button className="login-form-submit-button" type="submit"><p>Reset Password</p></button>
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