import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const useFetchWalletsList = () => {
    const [walletsList, setWalletsList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useAuth();

    const fetchWalletsList = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/wallets/availability/` + currentUser?.id,
            );

            setWalletsList(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { walletsList, fetchWalletsList, loading, error };
};

export default useFetchWalletsList;
