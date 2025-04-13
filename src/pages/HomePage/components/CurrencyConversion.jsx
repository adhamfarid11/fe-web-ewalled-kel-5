import { Select } from "antd";
import React, { useState, useEffect } from "react";
import currencyMapping from "../../../utils/currencyMapping";
import "./CurrencyConversion.scss";
import axios from "axios";
import formatBalance from "../../../utils/formatBalance";

const CurrencyConversion = ({ darkMode }) => {
    const [valueSender, setValueSender] = useState(0);
    const [valueRecipient, setValueRecipient] = useState(0);

    const currencyOptions = Object.entries(currencyMapping).map(
        ([code, data]) => ({
            value: data.flagId,
            label: `(${code}) ${data.currency} - ${data.country}`,
            title: code,
        }),
    );

    // default selected options
    const [sender, setSender] = useState(
        currencyOptions.find((opt) => opt.value === "US"),
    );
    const [recipient, setRecipient] = useState(
        currencyOptions.find((opt) => opt.value === "ID"),
    );

    const calculateCurrency = async (numSender, senderOpt, recipientOpt) => {
        if (!senderOpt || !recipientOpt) return 0;

        try {
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/02a5f529fbaf2d713be2821e/latest/${senderOpt.title}`,
            );
            const exchangeRates = response.data.conversion_rates;
            const recipientRate = exchangeRates[recipientOpt.title];
            return (recipientRate || 0) * numSender;
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            return 0;
        }
    };

    const handleSenderChange = async (selected) => {
        setSender(selected);
        const converted = await calculateCurrency(
            valueSender,
            selected,
            recipient,
        );
        setValueRecipient(parseFloat(converted.toFixed(2)));
    };

    const handleRecipientChange = async (selected) => {
        setRecipient(selected);
        const converted = await calculateCurrency(
            valueSender,
            sender,
            selected,
        );
        setValueRecipient(parseFloat(converted.toFixed(2)));
    };

    const handleSenderValueChange = (e) => {
        const val = Number(e.target.value);
        setValueSender(val);
    };

    useEffect(() => {
        const convert = async () => {
            const result = await calculateCurrency(
                valueSender,
                sender,
                recipient,
            );
            setValueRecipient(result);
        };

        if (sender && recipient) {
            convert();
        }
    }, [valueSender, sender, recipient]);

    return (
        <>
            <h1>Currency Conversion</h1>
            <div className="currency-conversion">
                <div className="left-conversion">
                    <div className="conversion-card">
                        <h1 className="text-sm text-gray-500">You Send</h1>
                        <div className="currency-input-with-flag">
                            <img
                                className="currency-flag"
                                src={`https://flagsapi.com/${sender?.value}/flat/64.png`}
                                alt="Currency Flag"
                            />
                            <Select
                                showSearch
                                placeholder="Select currency..."
                                optionFilterProp="label"
                                value={sender}
                                onChange={handleSenderChange}
                                options={currencyOptions}
                                style={{ height: 50 }}
                                className="custom-select"
                                labelInValue
                            />
                        </div>
                        <input
                            className="custom-input-number"
                            type="number"
                            min={0}
                            value={valueSender}
                            onChange={handleSenderValueChange}
                        />
                    </div>
                </div>
                <div className="right-conversion">
                    <div className="conversion-card">
                        <h1 className="text-sm text-gray-500">
                            Recipient Gets
                        </h1>
                        <div className="currency-input-with-flag">
                            <img
                                className="currency-flag"
                                src={`https://flagsapi.com/${recipient?.value}/flat/64.png`}
                                alt="Currency Flag"
                            />
                            <Select
                                showSearch
                                placeholder="Select currency..."
                                optionFilterProp="label"
                                value={recipient}
                                onChange={handleRecipientChange}
                                options={currencyOptions}
                                style={{ height: 50 }}
                                className="custom-select"
                                labelInValue
                            />
                        </div>
                        <input
                            className="custom-input-number"
                            type="number"
                            min={0}
                            value={valueRecipient}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CurrencyConversion;
