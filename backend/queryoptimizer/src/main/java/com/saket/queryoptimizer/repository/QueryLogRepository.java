package com.saket.queryoptimizer.repository;

import com.saket.queryoptimizer.model.QueryLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryLogRepository extends JpaRepository<QueryLog, Long> {
}