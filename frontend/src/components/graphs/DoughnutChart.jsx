import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { color } from "framer-motion";
import { Margin } from "react-to-pdf";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ correct, incorrect }) => {
  const data = {
    labels: ["Correct Words", "Mispronounced Words"],
    datasets: [
      {
        data: [correct, incorrect],
        backgroundColor: ["rgba(55, 84, 219, 0.8)", "rgba(255, 68, 55, 0.8)"], 
        borderColor: ["rgba(120, 149, 255, 1)", "rgba(255, 146, 174, 1)"],
        borderWidth: 1,
      },

    ],
    
  };

  const options = {
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Pronunciation Accuracy", font : { size: 16 , weight : "bold"} ,
    color: "#16192C" 
    },
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
