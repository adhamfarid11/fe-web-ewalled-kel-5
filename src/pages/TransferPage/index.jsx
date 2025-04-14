import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { message } from "antd";

import formatBalance from "../../utils/formatBalance";
import { useAuth } from "../../context/AuthContext";
import useWallet from "../../hooks/useWallet";
import useFetchWalletsList from "../../hooks/useFetchWalletsList";
import axiosInstance from "../../api/axiosInstance";
import TransferSuccessPage from "./components/TransferPageSuccess";

const TransferCategories = ["Food", "E-Commerce", "Transfer", "Entertainment"];

const TransferPage = () => {
    const [showBalance, setShowBalance] = useState(true);
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("Penerima");
    const [notes, setNotes] = useState("");
    const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
    const [category, setCategory] = useState("");

    const dropdownRef = useRef(null);

    const [transactionResult, setTransactionResult] = useState(null);
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    const { currentUser, isAuthenticated } = useAuth();
    const { wallet, fetchWalletAgain } = useWallet();
    const { walletsList, fetchWalletsList } = useFetchWalletsList();

    useEffect(() => {
        if (currentUser?.id) fetchWalletsList();
    }, [currentUser?.id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowRecipientDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAmountChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, "");

        if (value.length > 0) {
            const num = parseInt(value, 10);
            value = num.toLocaleString("id-ID");
        }

        setAmount(value);
    };

    const handleRecipientSelect = (user) => {
        setSelectedRecipient(user);
        setRecipient(`${user.user.fullname} (${user.accountNumber})`);
        setShowRecipientDropdown(false);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const resetForm = () => {
        setAmount("");
        setRecipient("Penerima");
        setNotes("");
        setSelectedRecipient(null);
        setTransactionResult(null);
        fetchWalletAgain();
    };

    const handleTransfer = async () => {
        const amountValue = amount.replace(/\./g, "").replace(",", ".");
        const numericAmount = parseFloat(amountValue);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            message.warning("Please enter a valid amount");
            return;
        }

        if (!recipient || recipient === "Penerima") {
            message.warning("Please select a recipient");
            return;
        }

        if (!selectedRecipient) {
            message.warning("Please select a valid recipient");
            return;
        }

        const recipientName = selectedRecipient.user.fullname;
        const recipientAccountNumber = selectedRecipient.accountNumber;

        try {
            const response = await axiosInstance.post(`/transactions`, {
                walletId: currentUser?.id,
                transactionType: "TRANSFER",
                recipientAccountNumber: recipientAccountNumber,
                category: category,
                amount: numericAmount,
                description: notes,
            });

            // Check if response has content before parsing JSON
            let data = {};

            // Create transaction result for success page
            setTransactionResult({
                transactionId: data.transactionId,
                amount: numericAmount,
                fromId: currentUser?.id || "",
                fromName: currentUser?.fullname,
                toId: recipientAccountNumber,
                toName: recipientName,
                description: notes || "-",
                success: true,
            });
        } catch (error) {
            console.error(
                "Error during transfer:",
                error.response.data.message,
            );
            message.warning(`Error: ${error?.response?.data?.message}`);
        }
    };

    // If we have a transaction result, show the success page
    if (transactionResult) {
        return (
            <TransferSuccessPage
                transaction={transactionResult}
                onClose={resetForm}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F6EE]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6 relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center justify-between w-full bg-gray-100 rounded-full p-3 cursor-pointer"
                                    onClick={() =>
                                        setShowRecipientDropdown(
                                            !showRecipientDropdown,
                                        )
                                    }
                                >
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center h-6 px-3 bg-gray-200 rounded-full">
                                            <span className="text-gray-600 text-sm">
                                                To
                                            </span>
                                        </div>
                                        <span className="text-gray-800 ml-2">
                                            {recipient}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-500"
                                    />
                                </div>

                                {showRecipientDropdown && (
                                    <div className="mt-1 border border-gray-200 rounded-lg shadow-md absolute bg-white z-10 w-full">
                                        {walletsList.length > 0 ? (
                                            walletsList.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                    onClick={() =>
                                                        handleRecipientSelect(
                                                            user,
                                                        )
                                                    }
                                                >
                                                    {user.user.fullname} - (
                                                    {user.accountNumber})
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-gray-500">
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-2">
                                    Amount
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-gray-900 text-xl font-medium mr-1">
                                            IDR{" "}
                                        </span>
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="text-gray-900 text-xl font-medium focus:outline-none w-full bg-transparent"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div className="w-full h-px bg-gray-200 mt-2"></div>
                                </div>
                            </div>

                            {showBalance && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Balance:
                                        </div>
                                        <div className="text-sm text-blue-400">
                                            {showBalance
                                                ? formatBalance(wallet?.balance)
                                                : "••••••••"}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="flex flex-col justify-between">
                                    <div className="text-sm text-gray-500 mb-2">
                                        Category:
                                    </div>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className={`bg-gray-50 border border-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                            category === ""
                                                ? "text-gray-400"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        <option value="" disabled hidden>
                                            Choose a category
                                        </option>
                                        {TransferCategories.map((cat) => (
                                            <option
                                                key={cat}
                                                value={cat}
                                                className="text-gray-900"
                                            >
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm text-gray-500 mb-2">
                                    Notes:
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <input
                                        type="text"
                                        value={notes}
                                        onChange={handleNotesChange}
                                        className="w-full bg-transparent focus:outline-none"
                                        placeholder="Add notes (optional)"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleTransfer}
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-[#211F1F] transition-colors text-center font-medium"
                            >
                                Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TransferPage;
