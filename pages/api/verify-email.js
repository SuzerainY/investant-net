import { STRAPIurl } from '@/my_modules/bloghelp';

export default async function handler(req, res) {
    const { confirmationToken } = req.query;

    try {
        // Verify the token and confirm the user
        const response = await fetch(`${STRAPIurl}/api/auth/email-confirmation?confirmation=${confirmationToken}`, {
            method: 'GET',
        });
        if (!response.ok) { throw new Error('Email Verification Failed.'); }

        // Redirect to login page
        res.writeHead(302, { Location: '/login' });
        res.end();
    } catch (error) { res.status(500).json({ message: error.message }); }
};