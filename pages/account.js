import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidPassword } from '@/my_modules/authenticationhelp';
import { STRAPIurl } from '@/my_modules/bloghelp';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function Account() {
    const router = useRouter();
    const { username, userSubscriptions, userSignedIn, userJWT } = useInvestantUserAuth();

    // Forms/blocks initialized
    const profileBlock = useRef(null);
    const subscriptionsBlock = useRef(null);
    const settingsBlock = useRef(null);
    const [activeBlock, setActiveBlock] = useState(profileBlock);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Profile Block Variables & Components
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');


    // Subscriptions Block Variables & Components
    const [blogPostSubscriptionChecked, setBlogPostSubscriptionChecked] = useState(userSubscriptions.blogPostSubscription);
    const handleBlogPostSubscriptionChange = () => {setBlogPostSubscriptionChecked(!blogPostSubscriptionChecked);}

    useEffect(() => {
        const verifySignIn = () => {
            if (router.isReady && userSignedIn !== undefined) {
                if (userSignedIn !== true) {
                    console.log(`User Signed In: ${userSignedIn}`);
                    router.push('/login?referrer=account');
                }
            }
        }; verifySignIn();
    }, [router.isReady, userSignedIn]);

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
            const googleRecaptchaScript = document.createElement('script');
            googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
            googleRecaptchaScript.async = true;
            googleRecaptchaScript.defer = true;
            document.body.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    const toggleShowPasswordForm = (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePasswordForm(!showChangePasswordForm);
    };

    const handleNewPassword = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');
        
        if (isValidPassword(newPassword) === false) {
            setError('Password Must Have No Spaces, Contain At Least 8 Characters, And Include 1 Special Character');
            return;
        } else if (newPassword !== confirmNewPassword) {
            setError('Your Passwords Do Not Match!');
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'investantWebUserAccountPageSetNewPasswordFormSubmission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/auth/change-password`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${userJWT}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            currentPassword: currentPassword,
                            password: newPassword,
                            passwordConfirmation: confirmNewPassword
                        })
                    });

                    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

                    setInfo('New Password Set!');
                } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    return (
        <>
            <DefaultLayout>
                <div className='account-page-container'>
                    <section className='account-page-sidebar-section'>
                    <div className='account-page-sidebar-section-text-container'>
                        <h2>My Account</h2>
                        <button className='account-page-sidebar-section-button' onClick={() => setActiveBlock(profileBlock)}><p>Profile</p></button>
                        <button className='account-page-sidebar-section-button' onClick={() => setActiveBlock(subscriptionsBlock)}><p>Subscriptions</p></button>
                        <button className='account-page-sidebar-section-button' onClick={() => setActiveBlock(settingsBlock)}><p>Settings</p></button>
                    </div>

                    </section>
                    <div className='account-page-forms-section'>
                        {activeBlock === profileBlock && (
                            <section ref={profileBlock} className='account-page-form-container'>
                                <div className='account-page-form-title'>
                                    <h1>Profile</h1>
                                </div>
                                <div className='account-page-form-body'>
                                    <div className='account-page-form-body-row'>
                                        <p>Username: <span className='account-page-form-body-row-span'>{username}</span></p>
                                    </div>
                                    <div className='account-page-form-body-row'>
                                        {showChangePasswordForm === false ? (
                                            <button className='account-page-form-body-row-button' onClick={toggleShowPasswordForm}>
                                                <p>Change Password</p>
                                            </button>
                                        ) : (
                                            <form className="account-page-form-body-row" onSubmit={handleNewPassword}>
                                                <div className="account-page-form-body-row">
                                                    <label className="account-page-form-body-row-label" htmlFor="currentPassword">Current Password</label>
                                                    <input
                                                        className="account-page-form-body-row-input"
                                                        type="password"
                                                        id="currentPassword"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="account-page-form-body-row">
                                                    <label className="account-page-form-body-row-label" htmlFor="password">New Password</label>
                                                    <input
                                                        className="account-page-form-body-row-input"
                                                        type="password"
                                                        id="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="account-page-form-body-row">
                                                    <label className="account-page-form-body-row-label" htmlFor="confirmPassword">Confirm New Password</label>
                                                    <input
                                                        className="account-page-form-body-row-input"
                                                        type="password"
                                                        id="confirmPassword"
                                                        value={confirmNewPassword}
                                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {error && <p className="account-page-form-body-row-error-message">{error}</p>}
                                                {info && <p className="account-page-form-body-row-info-message">{info}</p>}
                                                <div style={{ display: 'flex', width: 'fit-content' }}>
                                                    <button className="account-page-form-body-row-button" type="submit"><p>Set Password</p></button>
                                                    <button className="account-page-form-body-row-button" style={{ 'background-color': '#1B0053', 'margin': '0px 0px 0px 5px' }} onClick={toggleShowPasswordForm}><p>Cancel</p></button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeBlock === subscriptionsBlock && (
                            <section ref={subscriptionsBlock} className="account-page-form-container">
                                <div className="account-page-form-title">
                                    <h1>Subscriptions</h1>
                                </div>
                                <form className="account-page-form-body" onSubmit={() => {}}>
                                    <div className="account-page-form-body-row">
                                        <label className="account-page-form-body-row-label" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <input
                                                type="checkbox"
                                                checked={blogPostSubscriptionChecked}
                                                onChange={handleBlogPostSubscriptionChange}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <p style={blogPostSubscriptionChecked ? { opacity: '1' } : { opacity: '0.6' }}>Blog Post Emails</p>
                                        </label>
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <button
                                            type="submit"
                                            className="account-page-form-body-row-button"
                                        >
                                            <p>Save</p>
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        <section className="account-page-google-recaptcha-disclaimer-tag">
                            <p>
                                This site is protected by reCAPTCHA and the Google
                                <a href="https://policies.google.com/privacy"> Privacy Policy</a> and
                                <a href="https://policies.google.com/terms"> Terms of Service</a> apply.
                            </p>
                        </section>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};