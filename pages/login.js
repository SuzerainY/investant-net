import { useState } from "react";
import { useRouter } from 'next/router';
import { useInvestantUserAuth } from '@/context/GlobalContext';
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Login() {
    const { updateInvestantUser } = useInvestantUserAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginForm, setIsLoginForm] = useState(true);

    const handleFormToggle = (e) => {
        e.preventDefault();
        setError('');
        setIsLoginForm(!isLoginForm);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPIBASEURL}/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            updateInvestantUser({
                username: data.user.username,
                userFirstName: data.user.firstname,
                userLastName: data.user.lastname,
                userSignedIn: true,
                userConfirmedVerification: data.user.confirmed
            });

            router.push('/');
        } catch (error) {
            console.log(error);
            setError("Login failed. Did you forget your password? Please contact us if the issue persists.");
        }
    };

    return (
        <>
            <DefaultLayout>
                <div className="login-form-wrapper">
                    <div className="login-form-container">
                        <div className="login-form-title"><h1>{isLoginForm === true ? "Login" : "Sign Up"}</h1></div>
                        <form className="login-form" onSubmit={handleLogin}>
                            {isLoginForm === false && (
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
                            )}
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
                            <button className="login-form-submit-button" type="submit"><p>{isLoginForm === true ? "Login" : "Sign Up"}</p></button>
                        </form>
                        <div className="login-form-footer">
                            <p>{isLoginForm === true ? "Don't Have An Account?" : "Already Have An Account?"}</p>
                            <div className="login-form-toggle-switch-container">
                                <p className="login-form-toggle-label" style={{opacity: isLoginForm === true ? '0' : '100'}}>Login</p>
                                <label className="login-form-toggle-switch" onClick={handleFormToggle}>
                                    <input type="checkbox" id="toggle" className="login-form-toggle-input" checked={!isLoginForm}/>
                                    <span className="login-form-toggle-slider"></span>
                                </label>
                                <p className="login-form-toggle-label" style={{opacity: isLoginForm === true ? '100' : '0'}}>Sign Up</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}