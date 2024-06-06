import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the global context with default values
const InvestantUserContext = createContext({
    userJWT: String,
    username: String,
    userFirstName: String,
    userLastName: String,
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
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
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
                const firstName = localStorage.getItem('investantUserFirstName');
                const lastName = localStorage.getItem('investantUserLastName');
                const subscriptions = localStorage.getItem('investantUserSubscriptions');
                if (thyName) {setUsername(thyName);}
                if (firstName) {setUserFirstName(firstName);}
                if (lastName) {setUserLastName(lastName);}
                if (subscriptions) {setUserSubscriptions(subscriptions);}
            }
        }; verifyUserOnLoad();
    }, []);

    // Method to update user information
    const updateInvestantUser = (user) => {
        setUserJWT(prevUserJWT => user.userJWT !== undefined ? user.userJWT : prevUserJWT);
        setUsername(prevUsername => user.username !== undefined ? user.username : prevUsername);
        setUserFirstName(prevUserFirstName => user.userFirstName !== undefined ? user.userFirstName : prevUserFirstName);
        setUserLastName(prevUserLastName => user.userLastName !== undefined ? user.userLastName : prevUserLastName);
        setUserSubscriptions(prevUserSubscriptions => user.userSubscriptions !== undefined ? user.userSubscriptions : prevUserSubscriptions);
        setUserSignedIn(prevUserSignedIn => user.userSignedIn !== undefined ? user.userSignedIn : prevUserSignedIn);

        if (user.userJWT !== undefined) {localStorage.setItem('investantUserSession', user.userJWT);}
        if (user.username !== undefined) {localStorage.setItem('investantUsername', user.username);}
        if (user.userFirstName !== undefined) {localStorage.setItem('investantUserFirstName', user.userFirstName);}
        if (user.userLastName !== undefined) {localStorage.setItem('investantUserLastName', user.userLastName);}
        if (user.userSubscriptions !== undefined) {localStorage.setItem('investantUserSubscriptions', user.userSubscriptions);}
        if (user.userSignedIn === false) {
            localStorage.removeItem('investantUserSession');
            localStorage.removeItem('investantUsername');
            localStorage.removeItem('investantUserFirstName');
            localStorage.removeItem('investantUserLastName');
            localStorage.removeItem('investantUserSubscriptions');
        }
    };

    // Method to log off and clear our user information
    const clearInvestantUser = () => {
        setUserJWT('');
        setUsername('');
        setUserFirstName('');
        setUserLastName('');
        setUserSubscriptions({});
        setUserSignedIn(false);

        localStorage.removeItem('investantUserSession');
        localStorage.removeItem('investantUsername');
        localStorage.removeItem('investantUserFirstName');
        localStorage.removeItem('investantUserLastName');
        localStorage.removeItem('investantUserSubscriptions');
    };

    return (
        <InvestantUserContext.Provider
            value={{
                userJWT,
                username,
                userFirstName,
                userLastName,
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