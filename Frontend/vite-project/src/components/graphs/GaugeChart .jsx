import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ speechRate }) => {
  const numericSpeechRate = Math.min(Math.max(Number(speechRate), 0), 3);

  const COLORS = ["rgb(231, 24, 49)", "rgb(239, 198, 0)", "rgb(140, 214, 16)"];

  const getSpeechRateCategory = (rate) => {
    if (rate < 1.9) return 0; // Slow (Red)
    if (rate >= 1.9 && rate < 2.5) return 1; // Normal (Yellow)
    return 2; // Fast (Green)
  };

  const index = getSpeechRateCategory(numericSpeechRate);

  const data = useMemo(() => ({
    datasets: [
      {
        data: [numericSpeechRate, 3 - numericSpeechRate],
        backgroundColor: [COLORS[index], "rgb(234, 234, 234)"],
        borderWidth: 0,
      },
    ],
  }), [numericSpeechRate, index]);

  const options = useMemo(() => ({
    responsive: false,  // Prevents unnecessary resizing
    animation: { duration: 500 }, // Reduce animation time
    rotation: -90,
    circumference: 180,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }), []);

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <Doughnut data={data} options={options} />
      <h3 style={{ textAlign: "center", marginTop: "-40px" }}>
        Speech Rate: {isNaN(numericSpeechRate) ? "N/A" : numericSpeechRate.toFixed(2)} syll/sec
      </h3>
    </div>
  );
};

export default GaugeChart;
