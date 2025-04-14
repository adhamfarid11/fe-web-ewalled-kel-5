import React, { useState } from "react";
import useWallet from "../../../hooks/useWallet";
import formatBalance from "../../../utils/formatBalance";
import { Eye, Plus, Send } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const AccountBalance = ({ darkMode }) => {
    const [showBalance, setShowBalance] = useState(true);

    const { currentUser } = useAuth();

    const { wallet } = useWallet();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="md:col-span-3">
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-[#211F1F]"
                        } text-white rounded-xl p-4 h-full`}
                    >
                        <div className="text-sm opacity-80 mb-2">
                            Account No.
                        </div>
                        <div className="text-2xl font-bold">
                            {wallet?.accountNumber || "-"}
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
                                        : "bg-[#211F1F] hover:bg-blue-700"
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
                                        : "bg-[#211F1F] hover:bg-blue-700"
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
        </>
    );
};

export default AccountBalance;
