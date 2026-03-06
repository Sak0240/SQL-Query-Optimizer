package com.saket.queryoptimizer.model;

public class QueryComparisonResponse {

    private String originalQuery;
    private String optimizedQuery;

    private int originalScore;
    private int optimizedScore;

    public QueryComparisonResponse(String originalQuery,
                                   String optimizedQuery,
                                   int originalScore,
                                   int optimizedScore) {
                                                                this.originalQuery = originalQuery;
                                                                this.optimizedQuery = optimizedQuery;
                                                                this.originalScore = originalScore;
                                                                this.optimizedScore = optimizedScore;
    }

    public String getOriginalQuery() {
        return originalQuery;
    }

    public String getOptimizedQuery() {
        return optimizedQuery;
    }

    public int getOriginalScore() {
        return originalScore;
    }

    public int getOptimizedScore() {
        return optimizedScore;
    }
}