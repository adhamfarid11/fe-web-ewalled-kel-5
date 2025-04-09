import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import useProfile from "../hooks/useProfile";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { profile, fetchProfile } = useProfile();

    useEffect(() => {
        if (profile) {
            setCurrentUser(profile);
        }
    }, [profile]);

    const login = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        if (currentUser == null) fetchProfile();
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                setCurrentUser,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
