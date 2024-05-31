import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DefaultLayout from "@/layouts/DefaultLayout";
import { isValidPassword } from '@/my_modules/authenticationhelp';
import { STRAPIurl } from '@/my_modules/bloghelp';

export default function NewPassword() {
    const router = useRouter();
    const [userCode, setUserCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        if (router.isReady) {
            const { code } = router.query;
            setUserCode(code);
        }
    }, [router.isReady, router.query]);

    const handleNewPassword = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        
        if (!userCode) {
            setError('Reset Code Is Missing. This Page Is For Email Password Recovery Only.');
            return;
        } else if (newPassword !== confirmNewPassword) {
            setError('Your Passwords Do Not Match!');
            return;
        } else if (isValidPassword(newPassword) === false) {
            setError('Password Must Be 6 Or More Characters');
            return;
        }

        try {
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
    };
    return (
        <>
            <DefaultLayout>
                <div className="forgot-password-form-wrapper">
                    <div className="forgot-password-form-container">
                        <div className="forgot-password-form-title"><h1>Create New Password</h1></div>
                        <form className="forgot-password-form" onSubmit={handleNewPassword}>
                            <div className="forgot-password-form-row">
                                <label className="forgot-password-form-row-label" htmlFor="password">New Password</label>
                                <input
                                    className="forgot-password-form-row-input"
                                    type="password"
                                    id="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="forgot-password-form-row">
                                <label className="forgot-password-form-row-label" htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    className="forgot-password-form-row-input"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="forgot-password-form-error-message">{error}</p>}
                            {info && <p className="forgot-password-form-info-message">{info}</p>}
                            <button className="forgot-password-form-submit-button" type="submit"><p>Reset Password</p></button>
                        </form>
                        <div className="forgot-password-form-footer">
                            <p>Hey! Good To Go?</p>
                            <div className="forgot-password-form-toggle-switch-container">
                                <Link href="/login">
                                    <p className="forgot-password-form-toggle-label">Login</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};