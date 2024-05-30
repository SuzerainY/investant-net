import { useState } from "react";
import { useRouter } from 'next/router';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import DefaultLayout from "@/layouts/DefaultLayout";

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

    const handleFormToggle = (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setIsLoginForm(!isLoginForm);
    };

    // Email format validation regular expression
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPIBASEURL}/api/auth/local`, {
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
                } else {throw new Error('Unaccounted For Error Occurred.');}
            }

            // Only allow verified users to login
            if (data.user.confirmed !== true) {
                setError('Please Verify Your Email Before Logging In. If You Do Not See The Email, Check Your Spam Folder.');
            } else {
                updateInvestantUser({
                    username: data.user.username,
                    userFirstName: data.user.firstname,
                    userLastName: data.user.lastname,
                    userSignedIn: true,
                    userConfirmedVerification: data.user.confirmed
                });
                router.push('/');
            }
        } catch (error) {setError("Login Failed. Please Contact Us If The Issue Persists.");}
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');

        // Check if string is a valid email format
        if (isValidEmail(email) === false) {
            setError("Invalid email format");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPIBASEURL}/api/auth/local/register`, {
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
                } else {throw new Error('Unaccounted For Error Occurred.');}
            } else {setInfo('Sign Up Successful. Please Check Your Email To Verify Your Account And Login.');}
        } catch (error) {setError("There Was An Error Creating Your Account. Please Contact Us If The Issue Persists.");}
    }

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
                            <button className="login-form-forgot-password">
                                <p>Forgot Password</p>
                            </button>
                        )}
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};