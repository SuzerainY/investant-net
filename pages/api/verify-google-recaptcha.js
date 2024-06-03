export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { token } = req.body;
            if (!token) {throw new Error('Token is missing');}

            const googleRecaptchaSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
            if (!googleRecaptchaSecretKey) {throw new Error('Google reCAPTCHA secret key is not provided');}
    
            const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `secret=${googleRecaptchaSecretKey}&response=${token}`
            });
    
            if (!response.ok) {throw new Error('Failed To Verify Google reCAPTCHA Token');}

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {res.status(400).json({ error: error.message });}
    } else {res.status(405).json({ error: 'Method not allowed' });}
};