package com.saket.queryoptimizer.model;

import java.util.List;

public class QueryResponse {

    private List<String> suggestions;
    private String executionType;
    private String indexUsed;
    private String cost;
    private String optimizedQuery;
    private List<String> executionPlan;
    private int performanceScore;
    private int rowsScanned;
    private int executionTime;
    private int memoryUsage;
    private String complexity;
    private int suggestionsApplied;

    public QueryResponse(List<String> suggestions, String executionType, String indexUsed,
                         String cost, String optimizedQuery, List<String> executionPlan, int performanceScore,
                         int rowsScanned, int executionTime, int memoryUsage,
                         String complexity, int suggestionsApplied) {

        this.suggestions = suggestions;
        this.executionType = executionType;
        this.indexUsed = indexUsed;
        this.cost = cost;
        this.optimizedQuery = optimizedQuery;
        this.executionPlan = executionPlan;
        this.performanceScore = performanceScore;
        this.rowsScanned = rowsScanned;
        this.executionTime = executionTime;
        this.memoryUsage = memoryUsage;
        this.complexity = complexity;
        this.suggestionsApplied = suggestionsApplied;

    }
    public List<String> getSuggestions() {
        return suggestions;
    }
    public String getExecutionType() {
        return executionType;
    }
    public String getIndexUsed() {
        return indexUsed;
    }
    public String getCost() {
        return cost;
    }
    public String getOptimizedQuery() {return optimizedQuery;}
    public List<String> getExecutionPlan() {return executionPlan;}
    public int getPerformanceScore() {return performanceScore;}
    public int getRowsScanned() {return rowsScanned;}
    public int getExecutionTime() {return executionTime;}
    public int getMemoryUsage() {return memoryUsage;}
    public String getComplexity() {return complexity;}
    public int getSuggestionsApplied() {return suggestionsApplied;}
}