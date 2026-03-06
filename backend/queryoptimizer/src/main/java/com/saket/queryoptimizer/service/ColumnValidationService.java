package com.saket.queryoptimizer.service;

import com.saket.queryoptimizer.util.StringSimilarityUtil;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnValidationService {

    private final JdbcTemplate jdbcTemplate;

    public ColumnValidationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> getColumns(String table){

        String query = "SHOW COLUMNS FROM " + table;

        return jdbcTemplate.query(
                query,
                (rs, rowNum) -> rs.getString("Field")
        );
    }
    public String suggestColumn(String wrongColumn, List<String> columns){

        int minDistance = Integer.MAX_VALUE;
        String suggestion = null;

        for(String column : columns){

            int dist = StringSimilarityUtil.levenshtein(wrongColumn, column);

            if(dist < minDistance){
                minDistance = dist;
                suggestion = column;
            }
        }

        return suggestion;
    }
}