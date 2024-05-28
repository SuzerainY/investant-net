import { createContext, useContext, useState } from 'react';

// Create the global context with default values
const InvestantUserContext = createContext({
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
    const [username, setUsername] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userSignedIn, setUserSignedIn] = useState(false);
    const [userConfirmedVerification, setUserConfirmedVerification] = useState(false);

    // Method to update user information
    const updateInvestantUser = (user) => {
        setUsername(user.username || '');
        setUserFirstName(user.userFirstName || '');
        setUserLastName(user.userLastName || '');
        setUserSignedIn(user.userSignedIn || false);
        setUserConfirmedVerification(user.userConfirmedVerification || false);
        console.log("User has been updated");
    };

    return (
        <InvestantUserContext.Provider
            value={{
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