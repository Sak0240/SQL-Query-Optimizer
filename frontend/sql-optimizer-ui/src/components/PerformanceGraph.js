import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PerformanceGraph({ score, analysisTick }) {
  const data = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [score, Math.max(0, 100 - score)],
        backgroundColor: ["#22252c", "#e6e6e6"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <section className="panel-card top-equal-card performance-card">
      <div className="panel-head">
        <h3>Query Performance</h3>
      </div>

      <div className="performance-chart-wrap">
        <Doughnut key={`${analysisTick}-${score}`} data={data} options={options} />
      </div>

      <div className="score-label">Score: {score} / 100</div>
    </section>
  );
}

export default PerformanceGraph;
