import React from "react";

import AccountBalance from "./components/AccountBalance";
import HeaderGreeting from "./components/HeaderGreeting";
import CurrencyConversion from "./components/CurrencyConversion";

const HomePage = ({ darkMode }) => {
    return (
        <>
            <HeaderGreeting darkMode={darkMode} />
            <AccountBalance darkMode={darkMode} />
            <CurrencyConversion darkMode={darkMode} />
        </>
    );
};

export default HomePage;
