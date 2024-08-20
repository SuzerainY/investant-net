import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidUsername, isValidEmail, isValidPassword } from '@/my_modules/authenticationhelp';
import { STRAPIurl } from '@/my_modules/bloghelp';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function Account() {
    const router = useRouter();
    const { username, userEmail, userSubscriptions, userSignedIn, userJWT, updateInvestantUser } = useInvestantUserAuth();

    // Forms/blocks initialized
    const profileBlock = useRef(null);
    const subscriptionsBlock = useRef(null);
    const settingsBlock = useRef(null);
    const [activeBlock, setActiveBlock] = useState(profileBlock);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Sidebar Variables & Components
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);
    const accountPageSidebar = useRef(null);
    const accountPageFormsSection = useRef(null);
    const handleToggleSidebar = () => {
        if (accountPageSidebar.current) {
            setShowSidebarMenu(!showSidebarMenu);
            accountPageSidebar.current.classList.toggle('open');
        }
    };

    // Profile Block Variables & Components
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Subscriptions Block Variables & Components
    const [blogPostSubscriptionChecked, setBlogPostSubscriptionChecked] = useState(userSubscriptions.blogPostSubscription);
    const handleBlogPostSubscriptionChange = () => {setBlogPostSubscriptionChecked(!blogPostSubscriptionChecked);}

    // Settings Block Variables & Components
    const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] = useState(false);

    useEffect(() => {
        const handleClickOutsideSidebar = (event) => {
            let eventTarget = event.target;
            if (accountPageFormsSection.current?.contains(eventTarget) && showSidebarMenu === true) {handleToggleSidebar();}
        }; document.addEventListener('click', handleClickOutsideSidebar);

        return () => {document.removeEventListener('click', handleClickOutsideSidebar);};
    }, [showSidebarMenu]);

    useEffect(() => {
        const verifySignIn = () => {
            if (router.isReady && userSignedIn !== undefined) {
                if (userSignedIn !== true) {
                    router.push('/login?referrer=account');
                }
            }
        }; verifySignIn();

        const verifyUserSubscriptions = () => {
            setBlogPostSubscriptionChecked(userSubscriptions.blogPostSubscription);
        }; verifyUserSubscriptions();
    }, [router.isReady, userSignedIn, userSubscriptions]);

    useEffect(() => {
        const handleActiveBlockOnLoad = () => {
            if (router.isReady && router.query.block) {
                let possibleBlocks = ['profile', 'subscriptions', 'settings'];
                let blockIndex = possibleBlocks.indexOf(router.query.block);
                if (blockIndex >= 0) {
                    let refBlocks = [profileBlock, subscriptionsBlock, settingsBlock];
                    setActiveBlock(refBlocks[blockIndex]);
                }
            }
        }; handleActiveBlockOnLoad();
    }, [router.isReady, router.query.block]);

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
            const googleRecaptchaScript = document.createElement('script');
            googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
            googleRecaptchaScript.async = true;
            googleRecaptchaScript.defer = true;
            document.body.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    const changeActiveBlock = (block) => {
        setError('');
        setInfo('');
        setActiveBlock(block);
    };

    const handleNewUsername = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        if (isValidUsername(newUsername) === false) {
            setError('Username Must Be 20 Or Less Characters And Only Contain Letters, Digits, Underscores, Or Dashes');
            return;
        } else if (newUsername === username) {return;}

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Set_New_Username_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }
                    
                    const response = await fetch(`${STRAPIurl}/api/user/me`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${userJWT}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: newUsername
                        })
                    });
                    const data = await response.json();
    
                    if (!response.ok) {
                        // Handle Known Errors
                        if (data.message === 'Username already taken') {
                            setError('Username Already Taken');
                            return;
                        }
                        throw new Error('Unaccounted For Error Occurred.');
                    }
                        
                    updateInvestantUser({
                        username: data.userInfo.username
                    });
    
                    setInfo('Username Updated!');
                } catch (error) {setError('Unable To Change Username. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    const handleNewEmail = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        if (isValidEmail(newEmail) === false) {
            setError('Invalid Email Address');
            return;
        } else if (newEmail === userEmail) {return;}

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Set_New_Email_Form_Submission' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }
                    
                    const response = await fetch(`${STRAPIurl}/api/user/me`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${userJWT}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: newEmail
                        })
                    });
                    const data = await response.json();
    
                    if (!response.ok) {
                        // Handle Known Errors
                        if (data.message === 'Email already taken') {
                            setError('Email Already Taken');
                            return;
                        }
                        throw new Error('Unaccounted For Error Occurred.');
                    }
                        
                    updateInvestantUser({
                        userEmail: data.userInfo.email
                    });
    
                    setInfo('Email Updated!');
                } catch (error) {setError('Unable To Change Email. Please Contact Us If The Issue Persists.');}
            });
        });
    };

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
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Set_New_Password_Form_Submission' }).then(async (token) => {
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

    const handleSubscriptionsUpdate = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        // Add all possible user subscriptions here | This should match the userSubscriptions object
        const newUserSubscriptions = {
            blogPostSubscription: blogPostSubscriptionChecked
        };

        if (JSON.stringify(newUserSubscriptions) === JSON.stringify(userSubscriptions)) {return;}

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Update_User_Subscriptions' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/user/me`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${userJWT}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            blogPostSubscription: blogPostSubscriptionChecked
                        })
                    });

                    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}
                    
                    const data = await response.json();
                    updateInvestantUser({
                        userSubscriptions: {
                            blogPostSubscription: data.userInfo.blogPostSubscription
                        }
                    });

                    setInfo('Subscriptions Updated!');
                } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    const handleDeleteAccount = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'Investant_Web_User_Account_Page_Delete_Me' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (await verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    const response = await fetch(`${STRAPIurl}/api/user/me`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${userJWT}`,
                            'Content-Type': 'application/json'                            
                        }
                    });

                    if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

                    updateInvestantUser({userSignedIn: false});
                    setInfo('Account Successfully Deleted.');
                } catch (error) {setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    return (
        <>
            <Head>
                <title>Investant | Account</title>
                <meta name="description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Investant | Account" />
                <meta name="twitter:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta name="twitter:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />

                {/* Open Graph Meta Tags (for platforms like Facebook) */}
                <meta property="og:title" content="Investant | Account" />
                <meta property="og:description" content="Investant is a provider of independent financial research and tools for individuals who want to improve their financial literacy and education in today's economy." />
                <meta property="og:image" content="https://investant.net/images/branding/TransparentLogoHeader.png" />
                <meta property="og:url" content="https://investant.net/account" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Investant" />

                {/* Favicon */}
                <link rel="icon" href="/images/branding/FaviconTransparent.png" />
            </Head>

            <DefaultLayout>
                <div className='account-page-container'>
                    <button className='sidebar-toggle-button' onClick={handleToggleSidebar}>
                        <span className='sidebar-toggle-button-arrow'>
                            <Image
                                src={"/images/clipart/WhiteDropDownArrow.png"}
                                alt="Open Mobile Sidebar Arrow"
                                width={20}
                                height={20}
                                style={{rotate: showSidebarMenu ? '+90deg' : '-90deg'}}
                            />
                        </span>
                    </button>
                    <section ref={accountPageSidebar} className='account-page-sidebar-section'>
                        <div className='account-page-sidebar-section-text-container'>
                            <h2>My Account</h2>
                            <button className='account-page-sidebar-section-button' onClick={() => changeActiveBlock(profileBlock)}><p>Profile</p></button>
                            <button className='account-page-sidebar-section-button' onClick={() => changeActiveBlock(subscriptionsBlock)}><p>Subscriptions</p></button>
                            <button className='account-page-sidebar-section-button' onClick={() => changeActiveBlock(settingsBlock)}><p>Settings</p></button>
                        </div>
                    </section>

                    <div ref={accountPageFormsSection} className='account-page-forms-section'>
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
                                        <p>Email: <span className='account-page-form-body-row-span'>{userEmail}</span></p>
                                    </div>
                                    <form className='account-page-form-body-row' onSubmit={handleNewUsername}>
                                        <label className="account-page-form-body-row-label" htmlFor="newUsername">New Username</label>
                                        <input
                                            className='account-page-form-body-row-input'
                                            type='username'
                                            autoComplete='off'
                                            id='newUsername'
                                            value={newUsername}
                                            placeholder='investant_user'
                                            onChange={(e) => setNewUsername(e.target.value)}
                                        />
                                        <button className='account-page-form-body-row-button' type='submit'
                                            style={newUsername === username || newUsername === '' ? { cursor: 'default', opacity: '0.4' } : { cursor: 'pointer', opacity: '1' }}
                                        >
                                            <p>Change Username</p>
                                        </button>
                                    </form>
                                    <form className='account-page-form-body-row' onSubmit={handleNewEmail}>
                                        <label className="account-page-form-body-row-label" htmlFor="newEmail">New Email</label>
                                        <input
                                            className='account-page-form-body-row-input'
                                            type='email'
                                            autoComplete='off'
                                            id='newEmail'
                                            value={newEmail}
                                            placeholder='email@example.com'
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                        <button className='account-page-form-body-row-button' type='submit'
                                            style={newEmail === userEmail || newEmail === '' ? { cursor: 'default', opacity: '0.4' } : { cursor: 'pointer', opacity: '1' }}
                                        >
                                            <p>Change Email</p>
                                        </button>
                                    </form>
                                    <div className='account-page-form-body-row'>
                                        {error && <p className="account-page-form-body-row-error-message">{error}</p>}
                                        {info && <p className="account-page-form-body-row-info-message">{info}</p>}
                                        {showChangePasswordForm === false ? (
                                            <button className='account-page-form-body-row-button' onClick={toggleShowPasswordForm} style={{ backgroundColor: '#1B0053' }}>
                                                <p>Change Password</p>
                                            </button>
                                        ) : (
                                            <form className="account-page-form-body-row" onSubmit={handleNewPassword}>
                                                <div className="account-page-form-body-row">
                                                    <label className="account-page-form-body-row-label" htmlFor="currentPassword">Current Password</label>
                                                    <input
                                                        className="account-page-form-body-row-input"
                                                        type="password"
                                                        autoComplete='off'
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
                                                        autoComplete='off'
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
                                                        autoComplete='off'
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
                                <form className="account-page-form-body" onSubmit={handleSubscriptionsUpdate}>
                                    <div className="account-page-form-body-row">
                                        <label className="account-page-form-body-row-label" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <input
                                                type="checkbox"
                                                checked={blogPostSubscriptionChecked}
                                                onChange={handleBlogPostSubscriptionChange}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <p style={blogPostSubscriptionChecked ? { opacity: '1' } : { opacity: '0.6' }}>The Investant Blog</p>
                                        </label>
                                    </div>
                                    <div className="account-page-form-body-row">
                                        {error && <p className="account-page-form-body-row-error-message">{error}</p>}
                                        {info && <p className="account-page-form-body-row-info-message">{info}</p>}
                                    </div>
                                    <div className="account-page-form-body-row">
                                        <button type="submit" className="account-page-form-body-row-button"
                                            style={userSubscriptions.blogPostSubscription === blogPostSubscriptionChecked ? { cursor: 'default', opacity: '0.4' } : { cursor: 'pointer', opacity: '1' }}
                                        >
                                            <p>Save</p>
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        {activeBlock === settingsBlock && (
                            <section ref={settingsBlock} className="account-page-form-container">
                                <div className="account-page-form-title">
                                    <h1>Settings</h1>
                                </div>
                                <div className="account-page-form-body">
                                    <div className="account-page-form-body-row">
                                        <p className="account-page-form-body-row-info-message">Further Functionality Is In Development. We Are Committed To This Project And Will Continue To Deliver You More.</p>
                                    </div>
                                    <div className="account-page-form-body-row">
                                        {(showConfirmDeleteAccount === false) ? (
                                            <button
                                                className="account-page-form-body-row-button"
                                                onClick={() => {setInfo(''); setError(''); setShowConfirmDeleteAccount(true);}}
                                                style={{ backgroundColor: '#FFCC00', color: '#000000' }}
                                            >
                                                <p>Delete Account</p>
                                            </button>
                                        ) : (
                                            <>
                                                <p className="account-page-form-body-row-error-message">Are You Sure You Would Like To Delete Your Account?</p>
                                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}>
                                                    <button
                                                        className="account-page-form-body-row-button"
                                                        onClick={() => {handleDeleteAccount(); setShowConfirmDeleteAccount(false);}}
                                                        style={{ backgroundColor: '#FFCC00', color: '#000000', marginBottom: '10px' }}
                                                    >
                                                        <p>Yes, Delete My Account</p>
                                                    </button>
                                                    <button
                                                        className="account-page-form-body-row-button"
                                                        onClick={() => {setShowConfirmDeleteAccount(false);}}
                                                        style={{ marginBottom: '10px' }}
                                                    >
                                                        <p>No, Keep My Account</p>
                                                    </button>                                                
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="account-page-form-body-row">
                                        {error && <p className="account-page-form-body-row-error-message">{error}</p>}
                                        {info && <p className="account-page-form-body-row-info-message">{info}</p>}
                                    </div>                                    
                                    <div className="account-page-form-body-row">
                                        <p>Have Ideas Or Feedback? <Link href={'/contact-us'} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#E81CFF' }}>Please Contact Us</Link></p>
                                    </div>
                                </div>
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