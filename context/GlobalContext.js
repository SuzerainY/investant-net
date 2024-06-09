import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the global context with default values
const InvestantUserContext = createContext({
    userJWT: String,
    username: String,
    userEmail: String,
    userSubscriptions: {},
    userSignedIn: Boolean,
    updateInvestantUser: () => {},
    clearInvestantUser: () => {}
});

// Custom hook to use the InvestantUserContext
export const useInvestantUserAuth = () => useContext(InvestantUserContext);

// Create the provider component
export const InvestantUserAuthProvider = ({ children }) => {
    const [userJWT, setUserJWT] = useState('');
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userSubscriptions, setUserSubscriptions] = useState({});
    const [userSignedIn, setUserSignedIn] = useState(undefined);

    useEffect(() => {
        // On application load, we should check if the user has a non-expired JWT and update user accordingly
        const verifyUserOnLoad = () => {
            const session = localStorage.getItem('investantUserSession');
            if (session) {
                // If the token is expired, clear the user and return
                const decodedToken = jwtDecode(session);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    clearInvestantUser();
                    return;
                }

                setUserJWT(session);
                setUserSignedIn(true);
                const thyName = localStorage.getItem('investantUsername');
                const email = localStorage.getItem('investantUserEmail');
                const subscriptions = localStorage.getItem('investantUserSubscriptions');
                if (thyName) {setUsername(thyName);}
                if (email) {setUserEmail(email);}
                if (subscriptions) {setUserSubscriptions(JSON.parse(subscriptions));}
            } else {clearInvestantUser();}
        }; verifyUserOnLoad();
    }, []);

    // Method to update user information
    const updateInvestantUser = (user) => {
        setUserJWT(prevUserJWT => user.userJWT !== undefined ? user.userJWT : prevUserJWT);
        setUsername(prevUsername => user.username !== undefined ? user.username : prevUsername);
        setUserEmail(prevUserEmail => user.userEmail !== undefined ? user.userEmail : prevUserEmail);
        setUserSubscriptions(prevUserSubscriptions => user.userSubscriptions !== undefined ? user.userSubscriptions : prevUserSubscriptions);
        setUserSignedIn(prevUserSignedIn => user.userSignedIn !== undefined ? user.userSignedIn : prevUserSignedIn);

        if (user.userJWT !== undefined) {localStorage.setItem('investantUserSession', user.userJWT);}
        if (user.username !== undefined) {localStorage.setItem('investantUsername', user.username);}
        if (user.userEmail !== undefined) {localStorage.setItem('investantUserEmail', user.userEmail);}
        if (user.userSubscriptions !== undefined) {localStorage.setItem('investantUserSubscriptions', JSON.stringify(user.userSubscriptions));}
        if (user.userSignedIn === false) {
            localStorage.removeItem('investantUserSession');
            localStorage.removeItem('investantUsername');
            localStorage.removeItem('investantUserEmail');
            localStorage.removeItem('investantUserSubscriptions');
        }
    };

    // Method to log off and clear our user information
    const clearInvestantUser = () => {
        setUserJWT('');
        setUsername('');
        setUserEmail('');
        setUserSubscriptions({});
        setUserSignedIn(false);

        localStorage.removeItem('investantUserSession');
        localStorage.removeItem('investantUsername');
        localStorage.removeItem('investantUserEmail');
        localStorage.removeItem('investantUserSubscriptions');
    };

    return (
        <InvestantUserContext.Provider
            value={{
                userJWT,
                username,
                userEmail,
                userSubscriptions,
                userSignedIn,
                updateInvestantUser,
                clearInvestantUser
            }}
        >
            {children}
        </InvestantUserContext.Provider>
    );
};