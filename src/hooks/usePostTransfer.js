import { useState } from "react";
import axios from "axios";

// transactionData;
// {
//     "walletId" : "1",
//     "transactionType" : "TRANSFER", // "TRANSFER", "TOP_UP"
//     "category" :"Food",
//     "amount" : 100000,
//     "recipientAccountNumber": "002552886580",
//     "description" : "Transfer buat mu."
// }

const usePostTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const postTransaction = async (transactionData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "/api/transactions",
                transactionData,
            );
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, postTransaction };
};

export default usePostTransfer;
