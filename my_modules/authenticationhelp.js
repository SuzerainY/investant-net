export const googleRecaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

// Allow only digits, letters, dashes, and underscores + 1 <= length <= 20
export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/;
    return usernameRegex.test(username);
};

export const isValidEmail = (email) => {
    const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    return emailRegex.test(email);
};

// No spaces allowed, 8 <= length <= 100, at least 1 special characters
// No backticks ` or angle brackets <> allowed
export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.?])(?!.*[`<>])(?=.{8,100}$)\S*$/;
    return passwordRegex.test(password);
};

export const verifyGoogleRecaptcha = async (token) => {
    try {
        const googleRecaptchaResponse = await fetch('/api/verify-google-recaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        const googleRecaptchaData = await googleRecaptchaResponse.json();
        if (googleRecaptchaData.success === true && googleRecaptchaData.score > 0.5) {return true;}
        return false;
    } catch (error) {return false;}
};