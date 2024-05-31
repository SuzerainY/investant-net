// Email format validation regular expression
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Minimum of 6 characters for passwords
export const isValidPassword = (password) => {
    if (password.length < 6) {return false};
    return true;
}