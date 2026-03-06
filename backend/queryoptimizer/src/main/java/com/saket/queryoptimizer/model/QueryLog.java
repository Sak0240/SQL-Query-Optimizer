package com.saket.queryoptimizer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class QueryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String query;

    private String executionType;

    private String indexUsed;

    private String cost;

    private LocalDateTime createdAt;

    // getters setters
}