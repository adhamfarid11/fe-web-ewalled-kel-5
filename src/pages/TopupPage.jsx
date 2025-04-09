import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle, Printer } from "lucide-react";

const TopupSuccessPage = ({ transaction, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-green-500 rounded-full p-2 mb-4">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-medium text-green-500">
                        Topup Success
                    </h2>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="text-black font-medium text-right">
                            {transaction.amount.toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Id</span>
                        <span className="text-black font-medium text-right">
                            {transaction.transactionId}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">From</span>
                        <span className="text-black font-medium text-right">
                            {transaction.paymentMethod}
                        </span>{" "}
                        {/* Tampilkan metode pembayaran */}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Description</span>
                        <span className="text-black font-medium text-right">
                            {transaction.description}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                    >
                        <Printer size={16} className="mr-2" />
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const TopupPage = () => {
    const [showBalance, setShowBalance] = useState(true);
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("Pilih Metode"); // Default text
    const [notes, setNotes] = useState("");
    const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
    const [users, setUsers] = useState([]);
    const dropdownRef = useRef(null);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token"),
    );
    const [currentUser, setCurrentUser] = useState(null);
    const [transactionResult, setTransactionResult] = useState(null);
    const [selectedRecipient, setSelectedRecipient] = useState(null);

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
    };
    // Fetch user balance from the API
    const fetchUserBalance = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !currentUser?.id) return;

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${currentUser.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCurrentUser((prevUser) =>
                prevUser ? { ...prevUser, balance: data.balance } : null,
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

    // Fetch user balance when authenticated or user changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchUserBalance();
        }
    }, [isAuthenticated, currentUser?.id]);

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
    };

    const handleTopup = async () => {
        const amountValue = amount.replace(/\./g, "").replace(",", ".");
        const numericAmount = parseFloat(amountValue);

        // Validasi amount
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert("Masukkan jumlah top-up yang valid");
            return;
        }

        // Validasi metode pembayaran
        if (!selectedRecipient) {
            alert("Pilih metode pembayaran terlebih dahulu");
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
                alert("Pengguna tidak valid. Silakan login ulang.");
                return;
            }

            // Kirim permintaan top-up ke backend
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/transactions/topup`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: currentUser.id, // ID user yang melakukan top-up
                        amount: numericAmount, // Jumlah top-up
                        description: notes || "Topup", // Catatan (opsional)
                        paymentMethod: selectedRecipient.name, // Metode pembayaran (Credit Card, Bank Transfer, QRIS)
                    }),
                },
            );

            // Handle response dari backend
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(
                    `Topup gagal: ${response.status} ${response.statusText}`,
                );
            }

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

            // Perbarui saldo pengguna
            fetchUserBalance();
        } catch (error) {
            console.error("Error selama top-up:", error);
            alert("Top-up gagal");
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
