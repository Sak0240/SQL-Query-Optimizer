package com.saket.queryoptimizer.service;

import com.saket.queryoptimizer.model.QueryComparisonResponse;
import com.saket.queryoptimizer.model.QueryResponse;
import com.saket.queryoptimizer.util.ColumnExtractor;
import com.saket.queryoptimizer.util.TableNameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class QueryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private TableValidationService tableValidationService;
    @Autowired
    private ColumnValidationService columnValidationService;

    // ---------------- ANALYZE QUERY ----------------
    public QueryResponse analyzeQuery(String query) {

        List<String> suggestions = new ArrayList<>();
        List<String> executionPlan = new ArrayList<>();

        String type = "UNKNOWN";
        String key = "NONE";
        String cost = "LOW";
        int rowsScanned = 0;
        int executionTime = 0;
        int memoryUsage = 0;
        String complexity = "LOW";
        int suggestionsApplied = suggestions.size();

        String lowerQuery = query.toLowerCase();

        int performanceScore = calculateScore(query);

        String optimizedQuery = query;

        // ---------- Extract table ----------
        String table = TableNameExtractor.extractTable(query);

        List<String> tables = tableValidationService.getTables();

        // ---------- Validate Table ----------
        if (table != null && !tables.contains(table)) {

            String suggestion = tableValidationService.suggestTable(table, tables);

            suggestions.add("Table '" + table + "' not found. Did you mean '" + suggestion + "' ?");

            return new QueryResponse(suggestions,
                    type, key, cost, optimizedQuery,
                    executionPlan,performanceScore, rowsScanned, executionTime,
                    memoryUsage, complexity, suggestionsApplied
            );
        }

        // ---------- Validate Column ----------
        String column = ColumnExtractor.extractColumn(query);

        if (table != null && column != null) {

            List<String> columns = columnValidationService.getColumns(table);

            if (!columns.contains(column)) {

                String suggestion = columnValidationService.suggestColumn(column, columns);

                suggestions.add("Column '" + column + "' not found. Did you mean '" + suggestion + "' ?");
            }
        }

        // ---------- SELECT * detection ----------
        if (lowerQuery.contains("select *")) {

            optimizedQuery = query.replace("*", "id, name");

            suggestions.add("Replace SELECT * with specific columns.");

            cost = "MEDIUM";
        }

        // ---------- WHERE clause detection ----------
        if (!lowerQuery.contains("where")) {

            suggestions.add("Query does not contain WHERE clause. It may cause full table scan.");

            cost = "HIGH";
        }

        // ---------- EXPLAIN analysis ----------
        try {

            String explainQuery = "EXPLAIN " + query;

            List<Map<String, Object>> result = jdbcTemplate.queryForList(explainQuery);

            for (Map<String, Object> row : result) {

                int rows = Integer.parseInt(row.get("rows").toString());
                rowsScanned = rows;
                executionTime = rowsScanned / 50;

                if (executionTime < 10) {
                    executionTime = 10;
                }
                // ---------- memory usage ----------
                memoryUsage = rowsScanned / 100;

                if(memoryUsage < 1){
                    memoryUsage = 1;
                }
                type = row.get("type").toString();

                key = row.get("key") == null ? "NULL" : row.get("key").toString();

                String tableName = row.get("table").toString();

                executionPlan.add("SCAN TABLE " + tableName);

                // ---------- Calculate complexity ----------
                if(lowerQuery.contains("join")){
                    complexity = "HIGH";
                }
                else if(lowerQuery.contains("where")){
                    complexity = "MEDIUM";
                }
                else{
                    complexity = "LOW";
                }
                // ---------- Row scanning cost ----------
                if (rows > 10000) {

                    suggestions.add("Query cost HIGH: scanning many rows");

                    performanceScore -= 20;

                } else if (rows > 1000) {

                    suggestions.add("Query cost MEDIUM: scanning significant rows");

                    performanceScore -= 10;

                } else {

                    suggestions.add("Query cost LOW");
                }

                // ---------- Index usage ----------
                if ("NULL".equals(key)) {

                    executionPlan.add("FULL TABLE SCAN");

                    suggestions.add("No index used in query.");

                    performanceScore -= 15;

                } else {

                    executionPlan.add("INDEX LOOKUP using " + key);

                    suggestions.add("Index used: " + key);
                }

                // ---------- WHERE detection ----------
                if (lowerQuery.contains("where")) {

                    executionPlan.add("FILTER using WHERE condition");
                }

                // ---------- ORDER BY detection ----------
                if (lowerQuery.contains("order by")) {

                    executionPlan.add("SORT using ORDER BY");

                    suggestions.add("ORDER BY detected. Consider index on sorting column.");
                }

                // ---------- Full table scan detection ----------
                if ("ALL".equalsIgnoreCase(type)) {

                    suggestions.add("Full table scan detected. Consider adding indexes.");

                    performanceScore -= 20;
                }

                // ---------- Index suggestion ----------
                column = extractWhereColumn(query);

                if ("NULL".equals(key) && column != null) {

                    suggestions.add(
                            "Suggested Index: CREATE INDEX idx_" + tableName + "_" + column +
                                    " ON " + tableName + "(" + column + ");"
                    );
                }
            }

        } catch (Exception e) {

            suggestions.add("Error analyzing query.");
        }

        if (performanceScore < 0)
            performanceScore = 0;

        if (suggestions.isEmpty())
            suggestions.add("Query looks optimized.");

        return new QueryResponse(
                suggestions,
                type,
                key,
                cost,
                optimizedQuery,
                executionPlan,
                performanceScore,
                rowsScanned,
                executionTime,
                memoryUsage,
                complexity,
                suggestionsApplied
        );
    }

    // ---------------- WHERE COLUMN EXTRACTOR ----------------

    private String extractWhereColumn(String query) {

        String lower = query.toLowerCase();

        if (!lower.contains("where"))
            return null;

        String condition = lower.split("where")[1].trim();

        String column = condition.split("=")[0].trim();

        return column;
    }

    // ---------------- SCORE CALCULATOR ----------------

    private int calculateScore(String query) {

        int score = 100;

        String lower = query.toLowerCase();

        if (lower.contains("select *"))
            score -= 20;

        if (!lower.contains("where"))
            score -= 20;

        if (lower.contains("join"))
            score -= 10;

        if (score < 0)
            score = 0;

        return score;
    }

    // ---------------- OPTIMIZE QUERY ----------------

    public QueryResponse optimizeQuery(String query) {

        String lowerQuery = query.toLowerCase();

        List<String> suggestions = new ArrayList<>();
        List<String> executionPlan = new ArrayList<>();

        String optimizedQuery = query;

        int scoreBefore = calculateScore(query);

        if (lowerQuery.contains("select *")) {

            optimizedQuery = query.replace("*", "id, name");

            suggestions.add("Replaced SELECT * with specific columns");

        }

        if (!lowerQuery.contains("where")) {
            suggestions.add("Consider adding WHERE clause for filtering");
        }

        int scoreAfter = calculateScore(optimizedQuery);

        executionPlan.add("OPTIMIZATION APPLIED");

        return new QueryResponse(
                suggestions, "OPTIMIZED",
                "N/A", "LOW", optimizedQuery, executionPlan, scoreAfter, 0,       // rowsScanned
                5,                  // executionTime
                1,                  // memoryUsage
                "LOW",              // complexity
                suggestions.size()  // suggestionsApplied
        );
    }
    // ---------------- COMPARE OPTIMIZE QUERY WITH ORIGINAL ONE ----------------
    public QueryComparisonResponse compareQueries(String query) {

        int originalScore = calculateScore(query);

        String optimizedQuery = query;

        if(query.toLowerCase().contains("select *")){
            optimizedQuery = query.replace("*","id, name");
        }

        int optimizedScore = calculateScore(optimizedQuery);

        return new QueryComparisonResponse(
                query,
                optimizedQuery,
                originalScore,
                optimizedScore
        );
    }
}