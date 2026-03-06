package com.saket.queryoptimizer.util;

public class TableNameExtractor {

    public static String extractTable(String query) {

        query = query.toLowerCase();

        if(query.contains("from")){

            String[] parts = query.split("from");

            if(parts.length > 1){
                String tablePart = parts[1].trim();
                return tablePart.split(" ")[0];
            }
        }

        return null;
    }
}