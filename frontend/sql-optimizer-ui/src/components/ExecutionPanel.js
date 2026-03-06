import React from "react";
import { motion } from "framer-motion";

function ExecutionPanel({ executionType, indexUsed, cost, performanceScore, analysisTick }) {
  return (
    <section className="panel-card top-equal-card execution-card">
      <div className="panel-head">
        <h3>Execution Analysis</h3>
      </div>

      <motion.div key={`exec-${analysisTick}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <div className="metric-row compact">
          <span>Execution Type</span>
          <strong>{executionType || "Not available"}</strong>
        </div>

        <div className="metric-row compact">
          <span>Index Used</span>
          <strong>{indexUsed || "Not available"}</strong>
        </div>

        <div className="metric-row compact">
          <span>Query Cost</span>
          <strong>{cost || "Not available"}</strong>
        </div>

        <div className="metric-row compact">
          <span>Performance Score</span>
          <strong>{performanceScore} / 100</strong>
        </div>
      </motion.div>
    </section>
  );
}

export default ExecutionPanel;
