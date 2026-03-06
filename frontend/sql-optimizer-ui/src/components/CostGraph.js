import React from "react";
import { motion } from "framer-motion";

function CostGraph({ cost, analysisTick, onOptimizeQuery, isOptimizing, canOptimize }) {
  const getWidth = () => {
    if (cost === "LOW") return "30%";
    if (cost === "MEDIUM") return "65%";
    if (cost === "HIGH") return "100%";
    return "0%";
  };

  const getColor = () => {
    if (cost === "LOW") return "#4caf50";
    if (cost === "MEDIUM") return "#ff9800";
    if (cost === "HIGH") return "#f44336";
    return "#c8c8c8";
  };

  return (
    <section className="panel-card">
      <div className="panel-head">
        <h3>Query Cost</h3>
      </div>

      <div className="cost-track">
        <motion.div
          key={`${analysisTick}-${cost}`}
          className="cost-fill"
          initial={{ width: "0%" }}
          animate={{ width: getWidth(), backgroundColor: getColor() }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>

      <p className="cost-label">Cost Level: {cost || "N/A"}</p>

      <button
        type="button"
        className="cost-optimize-btn"
        onClick={onOptimizeQuery}
        disabled={isOptimizing || !canOptimize}
      >
        {isOptimizing ? "Optimizing..." : "Optimize Query"}
      </button>
    </section>
  );
}

export default CostGraph;
