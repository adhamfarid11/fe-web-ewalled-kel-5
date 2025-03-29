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

function App({ darkMode }) {
    const [showBalance, setShowBalance] = useState(true);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [currentUser, setCurrentUser] = useState(null);
    const [showCount, setShowCount] = useState(10);
    const [sortCriteria, setSortCriteria] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");

    // Format the balance as Indonesian Rupiah
    const formatBalance = (balance) => {
        if (balance === undefined) return "Rp 0,00";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
        })
            .format(balance)
            .replace("IDR", "Rp");
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // Fetch transactions from the API
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token || !currentUser?.id) {
                setTransactions([]);
                setTotalPages(1);
                setLoading(false);
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/transactions?userId=${
                    currentUser.id
                }&page=${
                    page - 1
                }&search=${searchTerm}&sort=${sortCriteria},${sortDirection}&size=${showCount}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTransactions(data.content || data);
            setTotalPages(data.totalPages || 1);
            setError(null);
        } catch (err) {
            setError(
                err.message ||
                    "Could not fetch transactions. Please check your connection and try again."
            );
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user balance from the API
    const fetchUserBalance = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !currentUser?.id) return;

            const response = await fetch(
                `http://localhost:8080/api/users/${currentUser.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCurrentUser((prevUser) =>
                prevUser ? { ...prevUser, balance: data.balance } : null
            );
        } catch (error) {
            console.error("Error fetching user balance:", error);
        }
    };

    // Load user data from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
            }
        }
    }, []);

    // Fetch transactions and user balance when authenticated or user changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchTransactions();
            fetchUserBalance();
        }
    }, [isAuthenticated, currentUser?.id]);

    // Fetch transactions when page, searchTerm, showCount, sortCriteria, or sortDirection changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchTransactions();
        }
    }, [page, searchTerm, showCount, sortCriteria, sortDirection]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    // Handle page navigation
    const goToPage = (newPage) => {
        setPage(newPage);
    };

    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString)
            .toLocaleString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            .replace(/\//g, "-");
    };

    return (
        <Router>
            <AppLayout
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                darkMode={darkMode}
            >
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                setIsAuthenticated={setIsAuthenticated}
                                darkMode={darkMode}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={<RegisterPage darkMode={darkMode} />}
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <>
                                    {/* Header and Balance Section */}
                                    <div
                                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        <div>
                                            <h1 className="text-xl sm:text-2xl font-bold mb-1">
                                                {getGreeting()},{" "}
                                                {currentUser?.namaLengkap ||
                                                    "User"}
                                            </h1>
                                            <p
                                                className={`text-sm sm:text-base ${
                                                    darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Check all your incoming and
                                                outgoing transactions here
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {currentUser?.namaLengkap ||
                                                        "User"}
                                                </div>
                                                <div
                                                    className={`text-sm ${
                                                        darkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {currentUser?.accountType ||
                                                        "Personal Account"}
                                                </div>
                                            </div>
                                            <img
                                                src="/images/user.png"
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Account and Balance Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                        <div className="md:col-span-3">
                                            <div
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-800"
                                                        : "bg-blue-600"
                                                } text-white rounded-xl p-4 h-full`}
                                            >
                                                <div className="text-sm opacity-80 mb-2">
                                                    Account No.
                                                </div>
                                                <div className="text-2xl font-bold">
                                                    {currentUser?.id ||
                                                        "100899"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-9">
                                            <div
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-700"
                                                        : "bg-white border-gray-200"
                                                } border rounded-xl p-4 h-full flex justify-between items-center`}
                                            >
                                                <div>
                                                    <div
                                                        className={`text-sm ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } mb-1`}
                                                    >
                                                        Balance
                                                    </div>
                                                    <div
                                                        className={`text-lg sm:text-xl font-semibold flex items-center ${
                                                            darkMode
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {showBalance
                                                            ? formatBalance(
                                                                  currentUser?.balance
                                                              )
                                                            : "••••••••"}
                                                        <button
                                                            onClick={() =>
                                                                setShowBalance(
                                                                    !showBalance
                                                                )
                                                            }
                                                            className={`ml-2 ${
                                                                darkMode
                                                                    ? "text-gray-400 hover:text-gray-200"
                                                                    : "text-gray-400 hover:text-gray-600"
                                                            }`}
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-700 hover:bg-gray-600"
                                                                : "bg-blue-600 hover:bg-blue-700"
                                                        } text-white rounded-full p-2`}
                                                        onClick={() =>
                                                            (window.location.href =
                                                                "/topup")
                                                        }
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                    <button
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-700 hover:bg-gray-600"
                                                                : "bg-blue-600 hover:bg-blue-700"
                                                        } text-white rounded-full p-2`}
                                                        onClick={() =>
                                                            (window.location.href =
                                                                "/transfer")
                                                        }
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transactions Section */}
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-800 border-gray-700"
                                                : "bg-white border-gray-200"
                                        } border rounded-xl`}
                                    >
                                        {/* Search, Show, and Sort Controls */}
                                        <div className="p-3 sm:p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Search
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                        size={18}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Search"
                                                        value={searchTerm}
                                                        onChange={(e) =>
                                                            setSearchTerm(
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyPress={(e) =>
                                                            e.key === "Enter" &&
                                                            handleSearch(e)
                                                        }
                                                        className={`pl-10 pr-4 py-2 border ${
                                                            darkMode
                                                                ? "border-gray-600 bg-gray-700 text-white"
                                                                : "border-gray-300 bg-white text-gray-900"
                                                        } rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <span
                                                        className={`text-sm ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } mr-2`}
                                                    >
                                                        Show
                                                    </span>
                                                    <select
                                                        value={showCount}
                                                        onChange={(e) =>
                                                            setShowCount(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        className={`flex items-center justify-between px-3 py-2 border ${
                                                            darkMode
                                                                ? "border-gray-600 bg-gray-700 text-white"
                                                                : "border-gray-300 bg-white text-gray-900"
                                                        } rounded-lg w-48`}
                                                    >
                                                        <option value={10}>
                                                            Last 10 transactions
                                                        </option>
                                                        <option value={20}>
                                                            Last 20 transactions
                                                        </option>
                                                        <option value={50}>
                                                            Last 50 transactions
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center">
                                                    <span
                                                        className={`text-sm ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } mr-2`}
                                                    >
                                                        Sort by
                                                    </span>
                                                    <select
                                                        value={sortCriteria}
                                                        onChange={(e) =>
                                                            setSortCriteria(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`flex items-center justify-between px-3 py-2 border ${
                                                            darkMode
                                                                ? "border-gray-600 bg-gray-700 text-white"
                                                                : "border-gray-300 bg-white text-gray-900"
                                                        } rounded-lg w-24`}
                                                    >
                                                        <option value="date">
                                                            Date
                                                        </option>
                                                        <option value="amount">
                                                            Amount
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="relative">
                                                    <select
                                                        value={sortDirection}
                                                        onChange={(e) =>
                                                            setSortDirection(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`flex items-center justify-between px-3 py-2 border ${
                                                            darkMode
                                                                ? "border-gray-600 bg-gray-700 text-white"
                                                                : "border-gray-300 bg-white text-gray-900"
                                                        } rounded-lg w-32`}
                                                    >
                                                        <option value="desc">
                                                            Descending
                                                        </option>
                                                        <option value="asc">
                                                            Ascending
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Transactions Table */}
                                        {loading ? (
                                            <div className="text-center py-10">
                                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                                <p
                                                    className={`mt-2 ${
                                                        darkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Loading transactions...
                                                </p>
                                            </div>
                                        ) : error ? (
                                            <div className="text-center py-10">
                                                <p className="text-red-500">
                                                    {error}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setError(null);
                                                        setLoading(true);
                                                        setPage(1);
                                                    }}
                                                    className={`mt-2 ${
                                                        darkMode
                                                            ? "text-blue-400 hover:text-blue-300"
                                                            : "text-blue-600 hover:text-blue-800"
                                                    }`}
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="hidden sm:block overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr
                                                                className={`border-y ${
                                                                    darkMode
                                                                        ? "border-gray-700 bg-gray-900"
                                                                        : "border-gray-200 bg-gray-50"
                                                                } text-sm ${
                                                                    darkMode
                                                                        ? "text-gray-400"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                <th className="px-4 py-3 text-left font-medium">
                                                                    Date & Time
                                                                </th>
                                                                <th className="px-4 py-3 text-left font-medium">
                                                                    Type
                                                                </th>
                                                                <th className="px-4 py-3 text-left font-medium">
                                                                    From / To
                                                                </th>
                                                                <th className="px-4 py-3 text-left font-medium">
                                                                    Description
                                                                </th>
                                                                <th className="px-4 py-3 text-right font-medium">
                                                                    Amount
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {transactions.length >
                                                            0 ? (
                                                                transactions.map(
                                                                    (
                                                                        transaction
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                transaction.id
                                                                            }
                                                                            className={`border-b ${
                                                                                darkMode
                                                                                    ? "border-gray-700 hover:bg-gray-800"
                                                                                    : "border-gray-200 hover:bg-gray-50"
                                                                            }`}
                                                                        >
                                                                            <td
                                                                                className={`px-4 py-3 text-sm ${
                                                                                    darkMode
                                                                                        ? "text-gray-300"
                                                                                        : "text-gray-900"
                                                                                }`}
                                                                            >
                                                                                {formatDateTime(
                                                                                    transaction.date
                                                                                )}
                                                                            </td>
                                                                            <td
                                                                                className={`px-4 py-3 text-sm ${
                                                                                    darkMode
                                                                                        ? "text-gray-300"
                                                                                        : "text-gray-900"
                                                                                }`}
                                                                            >
                                                                                {transaction.type ===
                                                                                "credit"
                                                                                    ? "Topup"
                                                                                    : "Transfer"}
                                                                            </td>
                                                                            <td
                                                                                className={`px-4 py-3 text-sm ${
                                                                                    darkMode
                                                                                        ? "text-gray-300"
                                                                                        : "text-gray-900"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    transaction.fromTo
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                className={`px-4 py-3 text-sm ${
                                                                                    darkMode
                                                                                        ? "text-gray-300"
                                                                                        : "text-gray-900"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    transaction.description
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                className={`px-4 py-3 text-sm text-right ${
                                                                                    transaction.type ===
                                                                                    "credit"
                                                                                        ? "text-green-600"
                                                                                        : darkMode
                                                                                        ? "text-gray-300"
                                                                                        : "text-gray-900"
                                                                                }`}
                                                                            >
                                                                                {transaction.type ===
                                                                                "credit"
                                                                                    ? "+"
                                                                                    : "-"}{" "}
                                                                                Rp{" "}
                                                                                {Math.abs(
                                                                                    transaction.amount
                                                                                ).toLocaleString()}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className={`text-center py-6 ${
                                                                            darkMode
                                                                                ? "text-gray-400"
                                                                                : "text-gray-500"
                                                                        }`}
                                                                    >
                                                                        No
                                                                        transactions
                                                                        found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Mobile View */}
                                                <div className="sm:hidden">
                                                    {transactions.length > 0 ? (
                                                        transactions.map(
                                                            (transaction) => (
                                                                <div
                                                                    key={
                                                                        transaction.id
                                                                    }
                                                                    className={`border-b ${
                                                                        darkMode
                                                                            ? "border-gray-700"
                                                                            : "border-gray-200"
                                                                    } p-4`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div
                                                                            className={`text-sm font-medium ${
                                                                                darkMode
                                                                                    ? "text-gray-300"
                                                                                    : "text-gray-900"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                transaction.fromTo
                                                                            }
                                                                        </div>
                                                                        <div
                                                                            className={`text-sm font-medium ${
                                                                                transaction.type ===
                                                                                "CREDIT"
                                                                                    ? "text-green-600"
                                                                                    : darkMode
                                                                                    ? "text-gray-300"
                                                                                    : "text-gray-900"
                                                                            }`}
                                                                        >
                                                                            {transaction.type ===
                                                                            "CREDIT"
                                                                                ? "+"
                                                                                : "-"}{" "}
                                                                            Rp{" "}
                                                                            {Math.abs(
                                                                                transaction.amount
                                                                            ).toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`text-xs ${
                                                                            darkMode
                                                                                ? "text-gray-400"
                                                                                : "text-gray-500"
                                                                        } mb-1`}
                                                                    >
                                                                        {
                                                                            transaction.date
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`text-xs ${
                                                                            darkMode
                                                                                ? "text-gray-400"
                                                                                : "text-gray-600"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.description
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`text-xs ${
                                                                            darkMode
                                                                                ? "bg-gray-700 text-gray-300"
                                                                                : "bg-gray-100 text-gray-700"
                                                                        } rounded px-2 py-1 mt-2 inline-block`}
                                                                    >
                                                                        {
                                                                            transaction.type
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div
                                                            className={`text-center py-6 ${
                                                                darkMode
                                                                    ? "text-gray-400"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            No transactions
                                                            found
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Pagination */}
                                                <div
                                                    className={`p-4 flex flex-col sm:flex-row items-center justify-between border-t ${
                                                        darkMode
                                                            ? "border-gray-700"
                                                            : "border-gray-200"
                                                    } gap-4`}
                                                >
                                                    <span
                                                        className={`text-sm ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        Page {page} of{" "}
                                                        {totalPages}
                                                    </span>
                                                    <div className="flex items-center space-x-1">
                                                        {page > 1 && (
                                                            <button
                                                                onClick={() =>
                                                                    goToPage(
                                                                        page - 1
                                                                    )
                                                                }
                                                                className={`px-3 py-1 text-sm ${
                                                                    darkMode
                                                                        ? "text-gray-400 hover:text-gray-200"
                                                                        : "text-gray-600 hover:text-gray-800"
                                                                }`}
                                                            >
                                                                Prev
                                                            </button>
                                                        )}
                                                        {Array.from(
                                                            {
                                                                length: Math.min(
                                                                    3,
                                                                    totalPages
                                                                ),
                                                            },
                                                            (_, i) => {
                                                                const pageNum =
                                                                    page > 2
                                                                        ? page -
                                                                          1 +
                                                                          i
                                                                        : i + 1;
                                                                if (
                                                                    pageNum <=
                                                                    totalPages
                                                                ) {
                                                                    return (
                                                                        <button
                                                                            key={
                                                                                pageNum
                                                                            }
                                                                            onClick={() =>
                                                                                goToPage(
                                                                                    pageNum
                                                                                )
                                                                            }
                                                                            className={`px-3 py-1 text-sm ${
                                                                                pageNum ===
                                                                                page
                                                                                    ? `border ${
                                                                                          darkMode
                                                                                              ? "border-gray-600 bg-gray-700 text-gray-300"
                                                                                              : "border-gray-300 bg-white text-gray-600"
                                                                                      } rounded`
                                                                                    : `${
                                                                                          darkMode
                                                                                              ? "text-blue-400 hover:text-blue-300"
                                                                                              : "text-blue-600 hover:text-blue-800"
                                                                                      }`
                                                                            }`}
                                                                        >
                                                                            {
                                                                                pageNum
                                                                            }
                                                                        </button>
                                                                    );
                                                                }
                                                                return null;
                                                            }
                                                        )}
                                                        {page < totalPages && (
                                                            <button
                                                                onClick={() =>
                                                                    goToPage(
                                                                        page + 1
                                                                    )
                                                                }
                                                                className={`px-3 py-1 text-sm ${
                                                                    darkMode
                                                                        ? "text-gray-400 hover:text-gray-200"
                                                                        : "text-gray-600 hover:text-gray-800"
                                                                }`}
                                                            >
                                                                Next
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transfer"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <TransferPage darkMode={darkMode} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/topup"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <TopupPage darkMode={darkMode} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
