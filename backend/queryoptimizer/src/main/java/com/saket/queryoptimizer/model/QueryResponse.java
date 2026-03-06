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

    public QueryResponse(List<String> suggestions, String executionType, String indexUsed,
                         String cost, String optimizedQuery, List<String> executionPlan, int performanceScore) {

        this.suggestions = suggestions;
        this.executionType = executionType;
        this.indexUsed = indexUsed;
        this.cost = cost;
        this.optimizedQuery = optimizedQuery;
        this.executionPlan = executionPlan;
        this.performanceScore = performanceScore;
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
}