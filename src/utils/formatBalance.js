// Format the balance as Indonesian Rupiah
const formatBalance = (balance) => {
    if (balance === undefined) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    })
        .format(balance)
        .replace("IDR", "Rp");
};

export default formatBalance;
