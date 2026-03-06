import React from "react";

function ComparisonPanel({ originalScore, optimizedScore }) {

  return (
    <section className="panel-card">

      <div className="panel-head">
        <h3>Query Comparison</h3>
      </div>

      <div className="metric-row">
        <span>Original Query Score</span>
        <strong>{originalScore}</strong>
      </div>

      <div className="metric-row">
        <span>Optimized Query Score</span>
        <strong>{optimizedScore}</strong>
      </div>

    </section>
  );
}

export default ComparisonPanel;