package com.saket.queryoptimizer.util;

public class ColumnExtractor {

    public static String extractColumn(String query) {

        query = query.toLowerCase();

        if(query.contains("select") && query.contains("from")){

            String columnPart = query.split("from")[0]
                    .replace("select","")
                    .trim();

            if(columnPart.contains(",")){
                return columnPart.split(",")[0].trim();
            }

            return columnPart;
        }

        return null;
    }
}