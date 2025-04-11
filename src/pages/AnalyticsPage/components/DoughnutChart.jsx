import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options = {
    cutout: "65%",
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                color: "#444",
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

export default function DoughnutChart({ categories }) {
    return (
        <div className="flex w-full justify-center items-center h-[40vh]">
            <Doughnut data={categories} options={options} />
        </div>
    );
}
