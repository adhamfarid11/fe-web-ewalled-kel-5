import React from "react";

import Table from "./components/Table";

import AccountBalance from "./components/AccountBalance";
import HeaderGreeting from "./components/HeaderGreeting";

const HomePage = ({ darkMode }) => {
    return (
        <>
            <HeaderGreeting darkMode={darkMode} />
            <AccountBalance darkMode={darkMode} />
        </>
    );
};

export default HomePage;
