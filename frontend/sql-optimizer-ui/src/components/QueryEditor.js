import React from "react";
import Editor from "@monaco-editor/react";

function QueryEditor({ query, setQuery, analyzeQuery, isLoading, apiError }) {
  return (
    <section className="panel-card editor-card">
      <div className="panel-head">
        <h3>Query Editor</h3>
        <span className="panel-tag">SQL</span>
      </div>

      <Editor
        height="280px"
        defaultLanguage="sql"
        value={query}
        onChange={(value) => setQuery(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
      
      <button
        onClick={analyzeQuery}
        className="analyze-btn"
        type="button"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? "Analyzing..." : "Analyze Query"}
      </button>

      {apiError ? <p className="error-text">{apiError}</p> : null}
    </section>
  );
}

export default QueryEditor;
