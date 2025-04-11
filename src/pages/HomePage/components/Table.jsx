import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Search } from "lucide-react";
import formatDateTime from "../../../utils/formatDateTime";

const Table = ({ darkMode }) => {
    const [totalPages, setTotalPages] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const [showCount, setShowCount] = useState(10);
    const [sortCriteria, setSortCriteria] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");

    const { isAuthenticated, currentUser } = useAuth();

    // Fetch transactions when page, searchTerm, showCount, sortCriteria, or sortDirection changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchTransactions();
        }
    }, [currentUser]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
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
                `${import.meta.env.VITE_API_URL}/transactions?walletId=${
                    currentUser.id
                }`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTransactions(data.data || data);
            setTotalPages(data.totalPages || 1);
            setError(null);
        } catch (err) {
            setError(
                err.message ||
                    "Could not fetch transactions. Please check your connection and try again.",
            );
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };
    const handleTransactionFromTo = (transaction) => {
        const id = JSON.parse(localStorage.getItem("user")).id;

        if (transaction.transactionType === "TRANSFER") {
            if (transaction?.sender?.id == id) {
                return transaction?.recipient?.fullname;
            }
            return transaction?.sender?.fullname;
        }
        return "-";
    };

    const isCredit = (transaction) => {
        const id = JSON.parse(localStorage.getItem("user")).id;

        if (transaction.transactionType === "TRANSFER") return true;

        return transaction?.sender?.id != id;
    };

    // Handle page navigation
    const goToPage = (newPage) => {
        setPage(newPage);
    };
    return (
        <>
            {/* Transactions Section */}
            <div
                className={`w-full ${
                    darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                } border rounded-3xl`}
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSearch(e)
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
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                } mr-2`}
                            >
                                Show
                            </span>
                            <select
                                value={showCount}
                                onChange={(e) =>
                                    setShowCount(Number(e.target.value))
                                }
                                className={`flex items-center justify-between px-3 py-2 border ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                } rounded-lg w-48`}
                            >
                                <option value={10}>Last 10 transactions</option>
                                <option value={20}>Last 20 transactions</option>
                                <option value={50}>Last 50 transactions</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <span
                                className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                } mr-2`}
                            >
                                Sort by
                            </span>
                            <select
                                value={sortCriteria}
                                onChange={(e) =>
                                    setSortCriteria(e.target.value)
                                }
                                className={`flex items-center justify-between px-3 py-2 border ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                } rounded-lg w-24`}
                            >
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={sortDirection}
                                onChange={(e) =>
                                    setSortDirection(e.target.value)
                                }
                                className={`flex items-center justify-between px-3 py-2 border ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                } rounded-lg w-32`}
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
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
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Loading transactions...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
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
                                    {transactions.length > 0 ? (
                                        transactions.map((transaction) => (
                                            <tr
                                                key={transaction.id}
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
                                                        transaction.transactionDate,
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-sm ${
                                                        darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {transaction.transactionType ===
                                                        "TOP_UP" && "Top Up"}
                                                    {transaction.transactionType ===
                                                        "TRANSFER" &&
                                                        "Transfer"}
                                                    {transaction.transactionType ===
                                                        "QR" && "QR Scan"}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-sm ${
                                                        darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {handleTransactionFromTo(
                                                        transaction,
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-sm ${
                                                        darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {transaction.description}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-sm text-right ${
                                                        !isCredit(transaction)
                                                            ? "text-green-600"
                                                            : darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {isCredit(transaction)
                                                        ? "-"
                                                        : "+"}{" "}
                                                    Rp{" "}
                                                    {Math.abs(
                                                        transaction.amount,
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className={`text-center py-6 ${
                                                    darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="sm:hidden">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
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
                                                {transaction.fromTo}
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
                                                {transaction.type === "CREDIT"
                                                    ? "+"
                                                    : "-"}{" "}
                                                Rp{" "}
                                                {Math.abs(
                                                    transaction.amount,
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
                                            {transaction.date}
                                        </div>
                                        <div
                                            className={`text-xs ${
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {transaction.description}
                                        </div>
                                        <div
                                            className={`text-xs ${
                                                darkMode
                                                    ? "bg-gray-700 text-gray-300"
                                                    : "bg-gray-100 text-gray-700"
                                            } rounded px-2 py-1 mt-2 inline-block`}
                                        >
                                            {transaction.type}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    className={`text-center py-6 ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    No transactions found
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div
                            className={`p-4 flex flex-col sm:flex-row items-center justify-between border-t ${
                                darkMode ? "border-gray-700" : "border-gray-200"
                            } gap-4`}
                        >
                            <span
                                className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                            >
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center space-x-1">
                                {page > 1 && (
                                    <button
                                        onClick={() => goToPage(page - 1)}
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
                                        length: Math.min(3, totalPages),
                                    },
                                    (_, i) => {
                                        const pageNum =
                                            page > 2 ? page - 1 + i : i + 1;
                                        if (pageNum <= totalPages) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() =>
                                                        goToPage(pageNum)
                                                    }
                                                    className={`px-3 py-1 text-sm ${
                                                        pageNum === page
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
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        return null;
                                    },
                                )}
                                {page < totalPages && (
                                    <button
                                        onClick={() => goToPage(page + 1)}
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
    );
};

export default Table;
