import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ wcpm, speechRate, pronScore, percentAttempt }) => {
  // Normalize Data (Convert to Percentage)
  const maxValues = { wcpm: 200, speechRate: 3.0, pronScore: 1.0, percentAttempt: 100 };

  const normalizedData = [
    (wcpm / maxValues.wcpm) * 100, 
    (speechRate / maxValues.speechRate) * 100, 
    (pronScore / maxValues.pronScore) * 100, 
    (percentAttempt / maxValues.percentAttempt) * 100
  ];

  const data = {
    labels: ["", "", "", ""],

    datasets: [
      {
        label: "WCPM",
        data: [normalizedData[0], 0, 0, 0], // Assign each data point to a separate dataset for color control
        backgroundColor: "rgba(55, 84, 219, 0.9)", // Blue
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 0,
        hoverBackgroundColor: "rgba(120, 149, 255, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        borderRadius: 10,
        barPercentage: 1.5,
        categoryPercentage: 0.7,
      },
      {
        label: "Speech Rate",
        data: [0, normalizedData[1], 0, 0], 
        backgroundColor: "rgba(255, 195, 61, 1)",
        borderColor: "rgba(243, 221, 24, 1)",
        borderWidth: 0,
        hoverBackgroundColor: "rgba(255, 195, 61, 0.6)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
        borderRadius: 10,
        barPercentage: 1.5,
        categoryPercentage: 0.7,
      },
      {
        label: "Pronunciation Score",
        data: [0, 0, normalizedData[2], 0], 
        backgroundColor: "rgba(255, 68, 55, 0.8)", // Pink
        borderColor: "rgba(253, 129, 156, 1)",
        borderWidth: 0,
        hoverBackgroundColor: "rgba(255, 68, 55, 0.5)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
        borderRadius: 10,
        barPercentage: 1.5,
        categoryPercentage: 0.7,
      },
      {
        label: "Percent Attempt",
        data: [0, 0, 0, normalizedData[3]], 
        backgroundColor: "rgba(75, 192, 192, 1)", // Teal
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 0,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
        borderRadius: 10,
        barPercentage: 1.5,
        categoryPercentage: 0.7,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Speech Assessment Metrics (Scaled to 100%)", font : { size: 15 , weight : "bold"} ,
          color: "#16192C" 
          },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: true },
        beginAtZero: true,
        max: 100, // Scale Y-axis from 0 to 100%
      },
    },
  };

  return (
    <div style={{ width: "540px", height: "270px"  }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
