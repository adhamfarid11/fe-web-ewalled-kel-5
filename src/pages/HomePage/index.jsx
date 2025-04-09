import { Eye, Plus, Search, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useWallet from "../../hooks/useWallet";
import Table from "./components/Table";

import formatBalance from "../../utils/formatBalance";

const HomePage = ({ darkMode }) => {
    const [showBalance, setShowBalance] = useState(true);

    const { currentUser } = useAuth();
    const { wallet } = useWallet();

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

    return (
        <>
            {/* Header and Balance Section */}
            <div
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                }`}
            >
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold mb-1">
                        {getGreeting()}, {currentUser?.namaLengkap || "User"}
                    </h1>
                    <p
                        className={`text-sm sm:text-base ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                        Check all your incoming and outgoing transactions here
                    </p>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <div className="text-right">
                        <div className="font-medium">
                            {currentUser?.fullName || "User"}
                        </div>
                        <div
                            className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            {currentUser?.accountType || "Personal Account"}
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
                            darkMode ? "bg-gray-800" : "bg-blue-600"
                        } text-white rounded-xl p-4 h-full`}
                    >
                        <div className="text-sm opacity-80 mb-2">
                            Account No.
                        </div>
                        <div className="text-2xl font-bold">
                            {currentUser?.id || "-"}
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
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                } mb-1`}
                            >
                                Balance
                            </div>
                            <div
                                className={`text-lg sm:text-xl font-semibold flex items-center ${
                                    darkMode ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {showBalance
                                    ? formatBalance(wallet?.balance)
                                    : "••••••••"}
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
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
                                    (window.location.href = "/topup")
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
                                    (window.location.href = "/transfer")
                                }
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Table darkMode={darkMode} />
        </>
    );
};

export default HomePage;
