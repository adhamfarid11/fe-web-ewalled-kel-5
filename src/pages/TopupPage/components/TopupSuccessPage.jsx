import { CheckCircle, Printer } from "lucide-react";

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
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-[#211F1F]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopupSuccessPage;
