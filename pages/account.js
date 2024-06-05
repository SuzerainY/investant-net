import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidPassword } from '@/my_modules/authenticationhelp';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function Account() {
    const router = useRouter();

    const { username } = useInvestantUserAuth();
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
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

    const toggleShowPasswordForm = (e) => {
        if (e) {e.preventDefault();}
        setShowChangePasswordForm(!showChangePasswordForm);
    }

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

                    /*
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
                    */

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
                        <p>Account Info</p>
                        <p>Subscriptions</p>
                        <p>Settings</p>
                    </div>

                    </section>
                    <section className='account-page-forms-section'>
                        <div className='account-page-form-container'>
                            <div className='account-page-form-title'>
                                <h1>Account Info</h1>
                            </div>
                            <div className='account-page-form-body'>
                                <div className='account-page-form-body-row'>
                                    <p>Username: <span className='account-page-form-body-row-span'>Ryan</span></p>
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
                                                <button className="account-page-form-body-row-button" type="submit"><p>Reset Password</p></button>
                                                <button className="account-page-form-body-row-button" style={{ 'background-color': '#1B0053', 'margin': '0px 0px 0px 5px' }} onClick={toggleShowPasswordForm}><p>Cancel</p></button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </DefaultLayout>
        </>
    );
};