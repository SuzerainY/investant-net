import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the global context with default values
const InvestantUserContext = createContext({
    userJWT: String,
    username: String,
    userFirstName: String,
    userLastName: String,
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
    const [userSignedIn, setUserSignedIn] = useState(false);

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
                if (thyName) {setUsername(thyName);}
                if (firstName) {setUserFirstName(firstName);}
                if (lastName) {setUserLastName(lastName);}
            }
        }; verifyUserOnLoad();
    }, []);

    // Method to update user information
    const updateInvestantUser = (user) => {
        setUserJWT(prevUserJWT => user.userJWT !== undefined ? user.userJWT : prevUserJWT);
        setUsername(prevUsername => user.username !== undefined ? user.username : prevUsername);
        setUserFirstName(prevUserFirstName => user.userFirstName !== undefined ? user.userFirstName : prevUserFirstName);
        setUserLastName(prevUserLastName => user.userLastName !== undefined ? user.userLastName : prevUserLastName);
        setUserSignedIn(prevUserSignedIn => user.userSignedIn !== undefined ? user.userSignedIn : prevUserSignedIn);

        if (user.userJWT !== undefined) {localStorage.setItem('investantUserSession', user.userJWT);}
        if (user.username !== undefined) {localStorage.setItem('investantUsername', user.username);}
        if (user.userFirstName !== undefined) {localStorage.setItem('investantUserFirstName', user.userFirstName);}
        if (user.userLastName !== undefined) {localStorage.setItem('investantUserLastName', user.userLastName);}
        if (user.userSignedIn === false) {
            localStorage.removeItem('investantUserSession');
            localStorage.removeItem('investantUsername');
            localStorage.removeItem('investantUserFirstName');
            localStorage.removeItem('investantUserLastName');
        }
    };

    // Method to log off and clear our user information
    const clearInvestantUser = () => {
        setUserJWT('');
        setUsername('');
        setUserFirstName('');
        setUserLastName('');
        setUserSignedIn(false);

        localStorage.removeItem('investantUserSession');
        localStorage.removeItem('investantUsername');
        localStorage.removeItem('investantUserFirstName');
        localStorage.removeItem('investantUserLastName');
    };

    return (
        <InvestantUserContext.Provider
            value={{
                userJWT,
                username,
                userFirstName,
                userLastName,
                userSignedIn,
                updateInvestantUser,
                clearInvestantUser
            }}
        >
            {children}
        </InvestantUserContext.Provider>
    );
};