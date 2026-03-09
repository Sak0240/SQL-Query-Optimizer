import React from "react";

function ComparisonPanel({
  originalQuery,
  optimizedQuery,
  originalScore,
  optimizedScore,
  rowsScanned,
  executionTime,
  memoryUsage,
  complexity,
  suggestionsApplied
}) {

  const sameQuery =
    originalQuery?.trim().toLowerCase() ===
    optimizedQuery?.trim().toLowerCase();

  const scoreDiff = optimizedScore - originalScore;

  return (
    <section className="panel-card">

      <div className="panel-head">
        <h3>Query Comparison</h3>
      </div>

      <div className="comparison-table">

        <div className="metric-row">
          <span>Original Query Score</span>
          <strong>{originalScore}</strong>
        </div>

        <div className="metric-row">
          <span>Optimized Query Score</span>
          <strong>{optimizedScore}</strong>
        </div>

        <div className="metric-row">
          <span>Score Improvement</span>
          <strong>
            {sameQuery ? "No optimization needed ✓" : `+${scoreDiff} points`}
          </strong>
        </div>

        <div className="metric-row">
          <span>Rows Scanned</span>
          <strong>{rowsScanned}</strong>
        </div>

        <div className="metric-row">
          <span>Execution Time</span>
          <strong>{executionTime} ms</strong>
        </div>

        <div className="metric-row">
          <span>Memory Usage</span>
          <strong>{memoryUsage} MB</strong>
        </div>

        <div className="metric-row">
          <span>Query Complexity</span>
          <strong>{complexity}</strong>
        </div>

        <div className="metric-row">
          <span>Suggestions Applied</span>
          <strong>{suggestionsApplied}</strong>
        </div>

      </div>

    </section>
  );
}

export default ComparisonPanel;