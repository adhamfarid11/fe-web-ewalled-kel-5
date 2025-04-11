import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const useTransactions = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState(null);

    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/transactions?walletId=${currentUser?.id}`,
                );

                setTransactions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.id) fetchTransactions();
    }, [currentUser?.id]);

    return { transactions, loading, error };
};

export default useTransactions;
