import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip as TooltipJS,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  scales,
} from "chart.js";
import { orange, purple, purpleLight } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  TooltipJS,
  Legend,
  Filler
);
const labels = getLast7Days();
const LineChartsOption = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};
const LineCharts = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Users",
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };
  return <Line data={data} options={LineChartsOption} />;
};

const DoughnutChartsOption = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cuout: 120,
};
const DoughnutCharts = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Total Chats vs Group Chats",
        backgroundColor: [purpleLight, orange],
        borderColor: [purple, orange],
        offset: 35,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: "10" }}
      data={data}
      options={DoughnutChartsOption}
    />
  );
};

export { LineCharts, DoughnutCharts };
