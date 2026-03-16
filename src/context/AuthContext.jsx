// create context to centrally store whether the user is logged in
import { createContext, useEffect, useState } from 'react';

import client from "../api/client.js";

// export AuthContext so other files (like useAuth hook) can import it directly
export const AuthContext = createContext(null)

// "provider" component to wrap parts of the app and make auth data available
export function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if we have a saved token, user was logged in
        const savedToken = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('email');

        if (savedToken) {
            setToken(savedToken);
            setEmail(savedEmail);
        }

        setLoading(false);  // we are done checking
    }, []); // empty array, run only once on mount

    //login function - calls backend api and stores the token
    // async so uses await to wait for api response
    const login = async (emailInput, password) => {
        // client.post sends POST request to /auth/login
        // await pauses until server responds
        const response = await client.post('/auth/login', {
            email: emailInput,
            password: password,
        });

        // server sends back {token: "...", email:"..."}
        const {token: newToken, email: newEmail} = response.data;

        // save to local storage so user stays logged in even after refresh
        localStorage.setItem('token', newToken);
        localStorage.setItem('email', newEmail);

        // update state
        setToken(newToken);
        setEmail(newEmail);
    };

    const register = async (emailInput, password) => {
        const response = await client.post('/auth/register', {
            email: emailInput,
            password: password,
        });

        const {token: newToken, email: newEmail} = response.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('email', newEmail);

        setToken(newToken);
        setEmail(newEmail);
    };

    // clear everything for logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setToken(null);
        setEmail(null);
    };

    // value is all the data we make available to other components
    const value = {
        token,  // JWT token
        email,  // user's email
        isLoggedIn: !!token,  // !! converts token to true/false (true if token exists)
        loading,  // true while checking auth state
        login, // login function
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

