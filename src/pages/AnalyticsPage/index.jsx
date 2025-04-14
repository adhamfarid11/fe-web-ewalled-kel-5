import React, { useState } from "react";
import DoughnutChart from "./components/DoughnutChart";
import Table from "../HomePage/components/Table";
import {
    groupTransactionsByExpenseAndCategory,
    groupTransactionsByIncomeAndCategory,
} from "../../utils/groupTransactionsByIncomeAndCategory";

import useTransactions from "../../hooks/useTransactions";

const AnalyticsPage = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState("Income");

    const { transactions, loading } = useTransactions();
    const expenseCategories =
        groupTransactionsByExpenseAndCategory(transactions);
    const incomeCategories = groupTransactionsByIncomeAndCategory(transactions);
    return (
        <div
            className={`flex flex-col justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 ${
                darkMode ? "text-white" : "text-gray-900"
            }`}
        >
            <div className="flex flex-col w-full mt-[20px] justify-center bg-white border border-gray-200 rounded-3xl">
                <div className="flex justify-between w-ful">
                    <h1 className="text-3xl font-semibold mx-4 mt-4 mb-2">
                        Analytics Overview
                    </h1>

                    <TabButtons
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                    />
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : activeTab === "Income" ? (
                    <>
                        <h1 className="text-xl font mx-4 ">
                            Your Total Income
                        </h1>
                        <DoughnutChart categories={incomeCategories} />
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font mx-4 ">
                            Your Total Expense
                        </h1>
                        <DoughnutChart categories={expenseCategories} />
                    </>
                )}
            </div>
            <Table darkMode={darkMode} transactions={transactions} />
        </div>
    );
};

export default AnalyticsPage;

const TabButtons = ({ setActiveTab, activeTab }) => {
    const tabList = ["Income", "Expense"];

    return (
        <div className="inline-flex mt-4 mr-4">
            {tabList.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border 
            ${
                activeTab === tab
                    ? "text-white bg-blue-700 border-blue-700"
                    : "text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700"
            }
            ${tab === tabList[0] ? "rounded-s-lg" : ""}
            ${tab === tabList[tabList.length - 1] ? "rounded-e-lg" : ""}
          `}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
};
