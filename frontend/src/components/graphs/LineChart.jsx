import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ assessmentData }) => {
  if (!assessmentData || assessmentData.length === 0) return <p>No data available</p>;

  const dates = assessmentData.map((entry) => entry.date);
  const wcpm = assessmentData.map((entry) => entry.wcpm);
  const speechRate = assessmentData.map((entry) => entry.speech_rate);
  const pronScore = assessmentData.map((entry) => entry.pron_score);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "WCPM",
        data: wcpm,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Speech Rate",
        data: speechRate,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Pronunciation Score",
        data: pronScore,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Student Progress Over Time" },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
