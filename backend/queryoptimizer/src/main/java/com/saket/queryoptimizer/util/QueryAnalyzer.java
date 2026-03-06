package com.saket.queryoptimizer.util;

import java.util.ArrayList;
import java.util.List;

public class QueryAnalyzer {

    public static List<String> analyze(String query){

        List<String> suggestions = new ArrayList<>();

        if(query.contains("SELECT *")){
            suggestions.add("Avoid using SELECT *. Specify required columns.");
        }

        if(!query.contains("WHERE")){
            suggestions.add("Query does not contain WHERE clause. It may cause full table scan.");
        }

        return suggestions;
    }
}