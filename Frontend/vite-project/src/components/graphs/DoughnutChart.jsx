import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ correct, incorrect }) => {
  const data = {
    labels: ["Correct Words", "Mispronounced Words"],
    datasets: [
      {
        data: [correct, incorrect],
        backgroundColor: ["rgba(120, 149, 255, 1)", "rgba(255, 146, 174, 1)"], 
        borderColor: ["rgba(120, 149, 255, 1)", "rgba(255, 146, 174, 1)"],
        borderWidth: 1,
      },

    ],
    
  };

  const options = {
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Pronunciation Accuracy" },
    },
    cutout: "50%", // Controls the center cutout size
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "280px", height: "270px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
