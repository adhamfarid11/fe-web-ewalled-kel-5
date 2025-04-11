import React from "react";
import { useAuth } from "../../../context/AuthContext";

const HeaderGreeting = ({ darkMode }) => {
    const { currentUser } = useAuth();

    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };
    return (
        <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 ${
                darkMode ? "text-white" : "text-gray-900"
            }`}
        >
            <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-1">
                    {getGreeting()}, {currentUser?.fullname || "User"}
                </h1>
                <p
                    className={`text-sm sm:text-base ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                    Check all your incoming and outgoing transactions here
                </p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <div className="text-right">
                    <div className="font-medium">
                        {currentUser?.fullname || "-"}
                    </div>
                    <div
                        className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        {currentUser?.username || "-"}
                    </div>
                </div>
                <img
                    src={currentUser?.avatarUrl || "/images/user.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
};

export default HeaderGreeting;
