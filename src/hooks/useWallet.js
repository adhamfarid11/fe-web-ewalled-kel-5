import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const useWallet = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [refetch, setRefetch] = useState(1);

    const { currentUser } = useAuth();

    const fetchWalletAgain = () => {
        setRefetch((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/wallets/${currentUser?.id}`,
                );

                setWallet(response);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.id) fetchWallet();
    }, [currentUser?.id, refetch]);

    return { wallet, fetchWalletAgain, loading, error };
};

export default useWallet;
