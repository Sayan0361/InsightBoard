import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Key for localStorage
const AUTH_KEY = 'insightboard_auth';

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth state on initial load
    useEffect(() => {
        const storedAuth = localStorage.getItem(AUTH_KEY);
        if (storedAuth) {
            try {
                const { isLoggedIn: storedLogin, expiresAt } = JSON.parse(storedAuth);
                // Check if the session is still valid
                if (expiresAt && new Date(expiresAt) > new Date()) {
                    setIsLoggedIn(true);
                } else {
                    // Clear expired session
                    localStorage.removeItem(AUTH_KEY);
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
                localStorage.removeItem(AUTH_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const setLoginStatus = (status) => {
        if (status) {
            // Set session to expire in 7 days
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            
            const authData = {
                isLoggedIn: true,
                expiresAt: expiresAt.toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        } else {
            localStorage.removeItem(AUTH_KEY);
        }
        setIsLoggedIn(status);
    }

    const value = {
        isLoggedIn,
        setLoginStatus,
        isLoading
    };

    // Show loading state while checking auth
    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}