import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import DefaultLayout from "@/layouts/DefaultLayout";
import Link from "next/link";
import { googleRecaptchaSiteKey, verifyGoogleRecaptcha, isValidUsername, isValidEmail, isValidPassword } from "@/my_modules/authenticationhelp";
import { STRAPIurl } from '@/my_modules/bloghelp';

export default function Login() {
    const { updateInvestantUser } = useInvestantUserAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [usernameEmail, setUsernameEmail] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginForm, setIsLoginForm] = useState(true);

    useEffect(() => {
        const loadGoogleRecaptcha = () => {
            const googleRecaptchaScript = document.createElement('script');
            googleRecaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;
            googleRecaptchaScript.async = true;
            googleRecaptchaScript.defer = true;
            document.head.appendChild(googleRecaptchaScript);
        }; loadGoogleRecaptcha();
    }, []);

    const handleFormToggle = (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');
        setIsLoginForm(!isLoginForm);
    };

    const handleLogin = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        // Check for valid username and/or password:
        if (usernameEmail.includes("@")) {
            if (isValidEmail(usernameEmail) === false) {
                setError('Invalid Email Address. If This Is Your Correct Email, Please Contact Us To Recover Your Account.');
                return;
            }
        } else if (isValidUsername(usernameEmail) === false) {
            setError('Invalid Username Format. If This Is Your Correct Username, Please Contact Us To Recover Your Account.');
            return;
        } else if (isValidPassword(password) === false) {
            setError("Invalid Username/Email or Password.");
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'investantWebUserLogin' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (verifyGoogleRecaptcha(token) !== true) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    // This API request will return a signed JWT and user object if the user logs in successfully
                    const response = await fetch(`${STRAPIurl}/api/auth/local`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            identifier: usernameEmail,
                            password: password
                        })
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        // Catch known default STRAPI Errors
                        if (data.error.message === 'Invalid identifier or password') {
                            setError('Invalid Username/Email or Password');
                            return;
                        } else {throw new Error('Unaccounted For Error Occurred.');}
                    } else if (data.user.confirmed !== true) {
                        setError('Please Verify Your Email Before Logging In. If You Do Not See The Email, Check Your Spam Folder.');
                        return;
                    }

                    updateInvestantUser({
                        userJWT: data.jwt,
                        username: data.user.username,
                        userFirstName: data.user.firstname,
                        userLastName: data.user.lastname,
                        userSignedIn: true
                    });
                    router.push('/');
                } catch (error) {setError("Login Failed. Please Contact Us If The Issue Persists.");}
            });
        });
    };

    const handleSignUp = async (e) => {
        if (e) {e.preventDefault();}
        setError('');
        setInfo('');

        // Check if string is a valid email format
        if (isValidUsername(username) === false) {
            setError("Invalid Username");
            return;
        } else if (isValidEmail(email) === false) {
            setError("Invalid Email Address");
            return;
        } else if (isValidPassword(password) === false) {
            setError("Password Must Have No Spaces, Contain At Least 8 Characters, And Include 1 Special Character");
            return;
        }

        grecaptcha.ready(() => {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'investantWebUserSignUp' }).then(async (token) => {
                try {
                    // Google Recaptcha Verification
                    if (verifyGoogleRecaptcha(token) === false) {
                        setError('We Believe You Are A Bot. Please Contact Us If The Issue Persists.');
                        return;
                    }

                    // This API request will create a user and send verification email if proper inputs provided
                    const response = await fetch(`${STRAPIurl}/api/auth/local/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password
                        })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        // Catch known default STRAPI Errors
                        if (data.error.message === 'Email or Username are already taken') {
                            setError('Username or Email Already Taken.');
                            return;
                        } else {throw new Error('Unaccounted For Error Occurred.');}
                    }

                    setInfo('Sign Up Successful. Please Check Your Email To Verify Your Account And Login.');
                } catch (error) {setError('There Was An Error Creating Your Account. Please Contact Us If The Issue Persists.');}
            });
        });
    };

    useEffect(() => {
        const handleFormOnLoad = () => {
            if (router.isReady && router.query.form === 'SignUp') {
                handleFormToggle();
                if (router.query.email) {setEmail(router.query.email);}
            }
        }; handleFormOnLoad();
    }, [router.isReady, router.query.form]);

    return (
        <>
            <DefaultLayout>
                <div className="login-form-wrapper">
                    <div className="login-form-container">
                        <div className="login-form-title"><h1>{isLoginForm === true ? "Login" : "Sign Up"}</h1></div>
                        <form className="login-form" onSubmit={isLoginForm === true ? handleLogin : handleSignUp}>
                            {isLoginForm === false && (
                                <>
                                    <div className="login-form-row">
                                        <label className="login-form-row-label" htmlFor="username">Username</label>
                                        <input
                                            className="login-form-row-input"
                                            type="username"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="login-form-row">
                                        <label className="login-form-row-label" htmlFor="email">Email</label>
                                        <input
                                            className="login-form-row-input"
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            {isLoginForm === true && (
                                <div className="login-form-row">
                                    <label className="login-form-row-label" htmlFor="usernameEmail">Username or Email</label>
                                    <input
                                        className="login-form-row-input"
                                        type="text"
                                        id="usernameEmail"
                                        value={usernameEmail}
                                        onChange={(e) => setUsernameEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="login-form-row">
                                <label className="login-form-row-label" htmlFor="password">Password</label>
                                <input
                                    className="login-form-row-input"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="login-form-error-message">{error}</p>}
                            {info && <p className="login-form-info-message">{info}</p>}
                            <button className="login-form-submit-button" type="submit"><p>{isLoginForm === true ? "Login" : "Sign Up"}</p></button>
                        </form>
                        <div className="login-form-footer">
                            <p>{isLoginForm === true ? "Don't Have An Account?" : "Already Have An Account?"}</p>
                            <button className="login-form-toggle-switch-container" onClick={handleFormToggle}>
                                <p className="login-form-toggle-label">{isLoginForm === true ? "Sign Up" : "Login"}</p>
                            </button>
                        </div>
                        {isLoginForm === true && (
                            <div className="login-form-forgot-password">
                                <Link href="recovery/forgot-password">
                                    <p>Forgot Password</p>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};