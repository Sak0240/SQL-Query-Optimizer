import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import QueryEditor from "./components/QueryEditor";
import ExecutionPanel from "./components/ExecutionPanel";
import SuggestionsPanel from "./components/SuggestionsPanel";
import PerformanceGraph from "./components/PerformanceGraph";
import CostGraph from "./components/CostGraph";

import "./styles/dashboard.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const getCostRank = (cost) => {
  const rank = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  return rank[cost] || 0;
};

const getApiErrorMessage = (error, fallback) => {
  const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
  if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
  if (error?.code === "ERR_NETWORK") return "Cannot connect to backend. Start backend server on port 8080 or set REACT_APP_API_BASE_URL.";
  return fallback;
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [executionType, setExecutionType] = useState("");
  const [indexUsed, setIndexUsed] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [cost, setCost] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [apiError, setApiError] = useState("");
  const [analysisTick, setAnalysisTick] = useState(0);

  const [originalStats, setOriginalStats] = useState(null);
  const [optimizedStats, setOptimizedStats] = useState(null);
  const [enteredQueryText, setEnteredQueryText] = useState("");
  const [optimizedQueryText, setOptimizedQueryText] = useState("");

  const hydrateResults = (data) => {
    setSuggestions(data.suggestions || []);
    setExecutionType(data.executionType || "");
    setIndexUsed(data.indexUsed || "");
    setPerformanceScore(data.performanceScore || 0);
    setCost(data.cost || "");
    setShowResults(true);
    setAnalysisTick((tick) => tick + 1);
  };

  const analyzeQuery = async () => {
    if (!query.trim()) return;

    try {
      setIsAnalyzing(true);
      setApiError("");
      const response = await axios.post(`${API_BASE_URL}/query/analyze`, { query });
      hydrateResults(response.data);
      setOriginalStats(response.data);
      setOptimizedStats(null);
      setEnteredQueryText(query);
      setOptimizedQueryText("");
    } catch (error) {
      console.error(error);
      setApiError(getApiErrorMessage(error, "Analyze Query failed. Please try again."));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeQuery = async () => {
    if (!query.trim()) return;

    try {
      setIsOptimizing(true);
      setApiError("");

      const sourceQuery = query;
      const [analyzeResponse, optimizeResponse] = await Promise.all([
        axios.post(`${API_BASE_URL}/query/analyze`, { query: sourceQuery }),
        axios.post(`${API_BASE_URL}/query/optimize`, { query: sourceQuery }),
      ]);

      hydrateResults(analyzeResponse.data);
      setOriginalStats(analyzeResponse.data);
      setOptimizedStats(optimizeResponse.data);
      setEnteredQueryText(sourceQuery);
      setOptimizedQueryText(optimizeResponse.data?.optimizedQuery || sourceQuery);
      setActivePage("analytics");
    } catch (error) {
      console.error(error);
      setApiError(getApiErrorMessage(error, "Optimize Query failed. Please try again."));
    } finally {
      setIsOptimizing(false);
    }
  };

  const originalScore = originalStats?.performanceScore || 0;
  const optimizedScore = optimizedStats?.performanceScore || 0;
  const scoreDelta = optimizedScore - originalScore;

  const originalCost = originalStats?.cost || "";
  const optimizedCost = optimizedStats?.cost || "";
  const costDelta = getCostRank(originalCost) - getCostRank(optimizedCost);

  return (
    <div className="page-shell">
      <div className="dashboard-bg">
        <Navbar activePage={activePage} onNavigate={setActivePage} />

        {activePage === "dashboard" ? (
          <div className={`dashboard-layout ${showResults ? "has-results" : ""}`}>
            <div className="query-wrap">
              <div className="query-stack">
                <QueryEditor
                  query={query}
                  setQuery={setQuery}
                  analyzeQuery={analyzeQuery}
                  isLoading={isAnalyzing}
                  apiError={apiError}
                />
                {showResults && (
                  <motion.div className="panel-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <CostGraph
                      cost={cost}
                      analysisTick={analysisTick}
                      onOptimizeQuery={optimizeQuery}
                      isOptimizing={isOptimizing}
                      canOptimize={Boolean(query.trim())}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {showResults && (
              <div className="right-stack">
                <div className="right-top-row">
                  <motion.div className="panel-wrap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <PerformanceGraph score={performanceScore} analysisTick={analysisTick} />
                  </motion.div>

                  <motion.div className="panel-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <ExecutionPanel
                      executionType={executionType}
                      indexUsed={indexUsed}
                      cost={cost}
                      performanceScore={performanceScore}
                      analysisTick={analysisTick}
                    />
                  </motion.div>
                </div>

                <motion.div className="panel-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <SuggestionsPanel suggestions={suggestions} analysisTick={analysisTick} />
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          <div className="analytics-grid">
            {!originalStats || !optimizedStats ? (
              <section className="panel-card empty-state-card">
                <h3>No comparison yet</h3>
                <p>Run query analysis, then click Optimize Query from Dashboard to compare entered and optimized query stats.</p>
              </section>
            ) : (
              <motion.section
                className="panel-card comparison-card comparison-table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="panel-head">
                  <h3>Entered vs Optimized</h3>
                </div>

                <div className="compare-grid compare-head">
                  <div>Metric</div>
                  <div>Entered Query</div>
                  <div>Optimized Query</div>
                  <div>Difference</div>
                </div>

                <div className="compare-grid">
                  <div className="compare-label">Query</div>
                  <div className="query-preview">{enteredQueryText || "Not available"}</div>
                  <div className="query-preview">{optimizedQueryText || "Not available"}</div>
                  <div className="compare-diff">Text updated</div>
                </div>

                <div className="compare-grid">
                  <div className="compare-label">Performance Score</div>
                  <div>{originalScore} / 100</div>
                  <div>{optimizedScore} / 100</div>
                  <div className={scoreDelta >= 0 ? "delta-good" : "delta-bad"}>
                    {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} points
                  </div>
                </div>

                <div className="compare-grid">
                  <div className="compare-label">Query Cost</div>
                  <div>{originalCost || "Not available"}</div>
                  <div>{optimizedCost || "Not available"}</div>
                  <div className={costDelta >= 0 ? "delta-good" : "delta-bad"}>
                    {costDelta > 0 ? `Improved by ${costDelta} level` : costDelta === 0 ? "No change" : "Increased"}
                  </div>
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
