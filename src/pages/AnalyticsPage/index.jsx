import React from "react";
import DoughnutChart from "./components/DoughnutChart";
import Table from "../HomePage/components/Table";

const AnalyticsPage = ({ darkMode }) => {
    return (
        <div
            className={`flex flex-col justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 ${
                darkMode ? "text-white" : "text-gray-900"
            }`}
        >
            <div className="flex flex-col w-full mt-[20px] justify-center bg-white border border-gray-200 rounded-3xl">
                <h1 className="text-3xl font-semibold m-4 ">
                    Analytics Overview
                </h1>
                <DoughnutChart />
            </div>
            <Table darkMode={darkMode} />
        </div>
    );
};

export default AnalyticsPage;
