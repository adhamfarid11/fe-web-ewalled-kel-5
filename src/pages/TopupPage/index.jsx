import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import useWallet from "../../hooks/useWallet";

import { message } from "antd";

import TopupSuccessPage from "./components/TopupSuccessPage";

const TopupPage = () => {
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("Pilih Metode"); // Default text
    const [notes, setNotes] = useState("");
    const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token"),
    );
    const [transactionResult, setTransactionResult] = useState(null);
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    const { currentUser } = useAuth();
    const { fetchWalletAgain, wallet } = useWallet();

    // Data metode pembayaran statis
    const paymentMethods = [
        { id: 1, name: "Credit Card" },
        { id: 2, name: "Bank Transfer" },
        { id: 3, name: "QRIS" },
    ];

    // Fungsi untuk memilih metode pembayaran
    const handleRecipientSelect = (method) => {
        setSelectedRecipient(method);
        setRecipient(method.name);
        setShowRecipientDropdown(false);
        setNotes("Top Up from " + method.name);
    };

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

    const handleTopup = async () => {
        const amountValue = amount.replace(/\./g, "").replace(",", ".");
        const numericAmount = parseFloat(amountValue);

        // Validasi amount
        if (isNaN(numericAmount) || numericAmount <= 0) {
            message.warning("Masukkan jumlah top-up yang valid");
            return;
        }

        // Validasi metode pembayaran
        if (!selectedRecipient) {
            message.warning("Pilih metode pembayaran terlebih dahulu");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            // Pastikan currentUser dan ID-nya ada
            if (!currentUser?.id) {
                message.warning("Pengguna tidak valid. Silakan login ulang.");
                return;
            }

            // Kirim permintaan top-up ke backend
            const response = await axiosInstance.post(`/transactions`, {
                walletId: wallet.id,
                transactionType: "TOP_UP",
                amount: numericAmount,
                recipientAccountNumber: "",
                description: notes,
            });

            // Tampilkan hasil transaksi sukses
            setTransactionResult({
                transactionId: `${Date.now()}${Math.floor(
                    Math.random() * 10000,
                )}`.substring(0, 14), // Generate transaction ID
                amount: numericAmount, // Jumlah top-up
                paymentMethod: selectedRecipient.name, // Metode pembayaran
                description: notes || "Topup", // Catatan transaksi
                success: true, // Status sukses
            });
        } catch (error) {
            console.error("Error selama top-up:", error);
            message.warning("Top-up gagal");
        }
    };

    // If we have a transaction result, show the success page
    if (transactionResult) {
        return (
            <TopupSuccessPage
                transaction={transactionResult}
                onClose={resetForm}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-lg shadow-sm p-6">
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
                                                From
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
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                                onClick={() =>
                                                    handleRecipientSelect(
                                                        method,
                                                    )
                                                }
                                            >
                                                {method.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                onClick={handleTopup}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-center font-medium"
                            >
                                Topup
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TopupPage;
