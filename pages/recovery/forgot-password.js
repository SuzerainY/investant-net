import { useState } from 'react';
import Link from 'next/link';
import DefaultLayout from "@/layouts/DefaultLayout";
import { isValidEmail } from "@/my_modules/authenticationhelp";
import { STRAPIurl } from '@/my_modules/bloghelp';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');

        // Check if string is a valid email format
        if (isValidEmail(email) === false) {
            setError("Invalid email address");
            return;
        }

        try {
            const response = await fetch(`${STRAPIurl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {throw new Error('Unaccounted For Error Occurred.');}

            setInfo('Email Sent. Please Check Your Inbox To Rest Your Password. If You Cannot Find The Message, Try Your Spam Folder!');
        } catch (error) {console.log(error.message); setError('Something Went Wrong. Please Contact Us If The Issue Persists.');}
    };
    return (
        <>
            <DefaultLayout>
                <div className="login-form-wrapper">
                    <div className="login-form-container">
                        <div className="login-form-title"><h1>Password Recovery</h1></div>
                        <form className="login-form" onSubmit={handleForgotPassword}>
                            <div className="login-form-row">
                                <label className="login-form-row-label" htmlFor="email">Email Address</label>
                                <input
                                    className="login-form-row-input"
                                    type="email"
                                    id="email"
                                    value={email}
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
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};