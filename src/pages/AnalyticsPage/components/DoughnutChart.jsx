import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
    labels: ["Food", "Transport", "Entertainment", "Bills", "Health", "Others"],
    datasets: [
        {
            label: "Expenses",
            data: [200, 150, 100, 75, 50, 25],
            backgroundColor: [
                "#A8DADC",
                "#457B9D",
                "#F4A261",
                "#E76F51",
                "#2A9D8F",
                "#F7B801",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
        },
    ],
};

const options = {
    cutout: "65%",
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                color: "#444", // optional
                font: {
                    size: 14,
                },
            },
        },
        datalabels: {
            color: "#fff",
            font: {
                weight: "bold",
                size: 14,
            },
            formatter: (value, context) => {
                const dataArr = context.chart.data.datasets[0].data;
                const total = dataArr.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${percentage}%`;
            },
        },
    },
    animation: {
        animateRotate: true,
        animateScale: true,
    },
};

export default function DoughnutChart() {
    return (
        <div className="flex w-full justify-center items-center h-[40vh]">
            <Doughnut data={data} options={options} />;
        </div>
    );
}
