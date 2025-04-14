import React, { useState } from "react";
import formatDateTime from "../../../utils/formatDateTime";

const Table = ({ darkMode, transactions }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const handleTransactionFromTo = (transaction) => {
        const id = JSON.parse(localStorage.getItem("user"))?.id;

        if (transaction.transactionType === "TRANSFER") {
            if (transaction?.sender?.id == id) {
                return transaction?.recipient?.fullname;
            }
            return transaction?.sender?.fullname;
        }
        return "-";
    };

    const isCredit = (transaction) => {
        const id = JSON.parse(localStorage.getItem("user"))?.id;

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
                                    {transactions?.length > 0 ? (
                                        transactions?.map((transaction) => (
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
                            {transactions?.length > 0 ? (
                                transactions?.map((transaction) => (
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
                    </>
                )}
            </div>
        </>
    );
};

export default Table;
