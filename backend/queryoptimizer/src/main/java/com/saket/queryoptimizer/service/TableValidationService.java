package com.saket.queryoptimizer.service;

import com.saket.queryoptimizer.util.StringSimilarityUtil;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableValidationService {

    private final JdbcTemplate jdbcTemplate;

    public TableValidationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> getTables() {

        return jdbcTemplate.queryForList("SHOW TABLES", String.class);
    }

    public boolean tableExists(String table, List<String> tables){

        return tables.contains(table);
    }
    public String suggestTable(String wrongTable, List<String> tables){

        int minDistance = Integer.MAX_VALUE;
        String suggestion = null;

        for(String table : tables){

            int dist = StringSimilarityUtil.levenshtein(wrongTable, table);

            if(dist < minDistance){
                minDistance = dist;
                suggestion = table;
            }
        }

        return suggestion;
    }
}