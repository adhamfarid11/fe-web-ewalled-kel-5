import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Eye, Plus, Send, Search, ChevronDown } from "lucide-react";
import TransferPage from "./pages/TransferPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import TopupPage from "./pages/TopupPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext";

function App({ darkMode }) {
    const { login, isAuthenticated } = useAuth();
    useEffect(() => {
        if (!isAuthenticated) {
            const token = localStorage.getItem("token");
            if (token) login(token);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Unprotected routes */}
                <Route
                    path="/login"
                    element={<LoginPage darkMode={darkMode} />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage darkMode={darkMode} />}
                />

                {/* Protected routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout darkMode={darkMode} />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/"
                        element={<HomePage darkMode={darkMode} />}
                    />
                    <Route
                        path="/transfer"
                        element={<TransferPage darkMode={darkMode} />}
                    />
                    <Route
                        path="/topup"
                        element={<TopupPage darkMode={darkMode} />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
