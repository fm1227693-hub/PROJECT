import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, loginUser as serviceLogin, logoutUser as serviceLogout, refreshUserSession } from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session hydration
        const session = getCurrentSession();
        setCurrentUser(session);
        setLoading(false);

        // Background live refresh from database
        if (session) {
            refreshUserSession().then(refreshed => {
                if (refreshed) setCurrentUser(refreshed);
            }).catch(() => {});
        }

        // Sync auth across multi-tab events
        const handleStorage = (e) => {
            if (e.key === 'optimum_auth_session') {
                const refreshed = getCurrentSession();
                setCurrentUser(refreshed);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = async (identifier, password) => {
        const user = await serviceLogin(identifier, password);
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        serviceLogout();
        setCurrentUser(null);
    };

    const refreshSession = async () => {
        const session = await refreshUserSession();
        setCurrentUser(session);
        return session;
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, login, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
