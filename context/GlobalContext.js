import { createContext, useContext, useState } from 'react';

// Create the global context with default values
const InvestantUserContext = createContext({
    userJWT: String,
    username: String,
    userFirstName: String,
    userLastName: String,
    userSignedIn: Boolean,
    userConfirmedVerification: Boolean,
    updateInvestantUser: () => {}
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
    const [userConfirmedVerification, setUserConfirmedVerification] = useState(false);

    // Method to update user information
    const updateInvestantUser = (user) => {
        setUserJWT(user.userJWT || '');
        setUsername(user.username || '');
        setUserFirstName(user.userFirstName || '');
        setUserLastName(user.userLastName || '');
        setUserSignedIn(user.userSignedIn || false);
        setUserConfirmedVerification(user.userConfirmedVerification || false);
    };

    return (
        <InvestantUserContext.Provider
            value={{
                userJWT,
                username,
                userFirstName,
                userLastName,
                userSignedIn,
                userConfirmedVerification,
                updateInvestantUser,
            }}
        >
            {children}
        </InvestantUserContext.Provider>
    );
};