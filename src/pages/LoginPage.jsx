import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        if (isAuthenticated) navigate(location.state?.from || "/");
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const message = params.get("message");
        if (message) {
            setSuccessMessage(decodeURIComponent(message));
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    withCredentials: true,
                },
            );
            login(response?.data?.token);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                    err.response?.data ||
                    "Login gagal. Silakan periksa email dan password Anda.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center">
                        <div className="text-blue-600 mr-2">
                            <img
                                src="/images/logo.png"
                                alt="E-Wallet Logo"
                                width="32"
                                height="32"
                            />
                        </div>
                        <h1 className="text-2xl font-bold">Walled</h1>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        Belum punya akun?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Daftar di sini
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block md:w-1/2 h-screen m-0 p-0">
                <div className="h-full w-full">
                    <img
                        src="/images/money.png"
                        alt="Money"
                        className="h-screen w-full object-cover"
                        style={{ display: "block", margin: 0, padding: 0 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
