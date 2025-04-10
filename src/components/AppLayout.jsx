import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AppLayout = ({ children, mobileMenuOpen, setMobileMenuOpen }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const noNavbarRoutes = ["/login", "/register"];
    const showNavbar =
        isAuthenticated && !noNavbarRoutes.includes(location.pathname);
    const [darkMode, setDarkMode] = useState(false);

    const { logout } = useAuth();

    // Effect untuk mengatur mode tema dari localStorage saat komponen dimuat
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode) {
            setDarkMode(savedMode === "true");
        }
    }, []);

    // Effect untuk menerapkan kelas tema pada dokumen
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

    // Function untuk toggle mode tema
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Function to handle navigation with page refresh
    const handleNavigation = (path) => {
        // Force a full page refresh by changing window.location
        window.location.href = path;
    };

    return (
        <div
            className={`min-h-screen ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
            } flex flex-col transition-colors duration-200`}
        >
            {showNavbar && (
                <header
                    className={`${
                        darkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                    } border-b w-full transition-colors duration-200`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`flex items-center ${
                                    darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                            >
                                <img
                                    src="/images/logo.png"
                                    alt="E-Wallet Logo"
                                    width="32"
                                    height="32"
                                />
                                <span className="ml-2 font-semibold">
                                    Walled
                                </span>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <a
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("/");
                                }}
                                className={`${
                                    location.pathname === "/"
                                        ? darkMode
                                            ? "text-blue-400 font-medium"
                                            : "text-blue-600 font-medium"
                                        : darkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                }`}
                            >
                                Dashboard
                            </a>
                            <a
                                href="/transfer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("/transfer");
                                }}
                                className={`${
                                    location.pathname === "/transfer"
                                        ? darkMode
                                            ? "text-blue-400 font-medium"
                                            : "text-blue-600 font-medium"
                                        : darkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                }`}
                            >
                                Transfer
                            </a>
                            <a
                                href="/topup"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("/topup");
                                }}
                                className={`${
                                    location.pathname === "/topup"
                                        ? darkMode
                                            ? "text-blue-400 font-medium"
                                            : "text-blue-600 font-medium"
                                        : darkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                }`}
                            >
                                Topup
                            </a>
                            <button
                                onClick={logout}
                                className={
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Sign Out
                            </button>

                            {/* Garis pembatas antara Sign Out dan icon mode */}
                            <div
                                className={`h-6 w-px ${
                                    darkMode ? "bg-gray-600" : "bg-gray-300"
                                }`}
                            ></div>

                            <button
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-full ${
                                    darkMode
                                        ? "bg-gray-700 text-yellow-300"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                aria-label={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                            >
                                {darkMode ? (
                                    <Sun size={20} />
                                ) : (
                                    <Moon size={20} />
                                )}
                            </button>
                        </nav>

                        <div className="md:hidden flex items-center space-x-2">
                            {/* Garis pembatas pada tampilan mobile */}
                            <div
                                className={`h-6 w-px ${
                                    darkMode ? "bg-gray-600" : "bg-gray-300"
                                }`}
                            ></div>

                            <button
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-full ${
                                    darkMode
                                        ? "bg-gray-700 text-yellow-300"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                aria-label={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                            >
                                {darkMode ? (
                                    <Sun size={20} />
                                ) : (
                                    <Moon size={20} />
                                )}
                            </button>
                            <button
                                className={`p-2 rounded-md ${
                                    darkMode
                                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div
                            className={`md:hidden border-t ${
                                darkMode ? "border-gray-700" : "border-gray-200"
                            } w-full`}
                        >
                            <div className="container mx-auto px-4 pt-2 pb-3 space-y-1">
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation("/");
                                    }}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        location.pathname === "/"
                                            ? darkMode
                                                ? "text-blue-400 bg-gray-800"
                                                : "text-blue-600 bg-gray-50"
                                            : darkMode
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Dashboard
                                </a>
                                <a
                                    href="/transfer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation("/transfer");
                                    }}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        location.pathname === "/transfer"
                                            ? darkMode
                                                ? "text-blue-400 bg-gray-800"
                                                : "text-blue-600 bg-gray-50"
                                            : darkMode
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Transfer
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation("#");
                                    }}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        darkMode
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Topup
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        darkMode
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Sign Out
                                </button>

                                {/* Garis pembatas horizontal pada menu mobile */}
                                <div
                                    className={`my-2 h-px w-full ${
                                        darkMode ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                                ></div>

                                <div className="flex items-center px-3 py-2">
                                    <span
                                        className={`text-base font-medium ${
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {darkMode ? "Light Mode" : "Dark Mode"}
                                    </span>
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`ml-auto p-2 rounded-full ${
                                            darkMode
                                                ? "bg-gray-700 text-yellow-300"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                        aria-label={
                                            darkMode
                                                ? "Switch to light mode"
                                                : "Switch to dark mode"
                                        }
                                    >
                                        {darkMode ? (
                                            <Sun size={20} />
                                        ) : (
                                            <Moon size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </header>
            )}

            <main
                className={`flex-grow w-full ${
                    !showNavbar
                        ? "p-0"
                        : "container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
                }`}
            >
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
