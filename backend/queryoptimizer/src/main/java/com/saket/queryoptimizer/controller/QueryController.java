package com.saket.queryoptimizer.controller;

import com.saket.queryoptimizer.model.QueryComparisonResponse;
import com.saket.queryoptimizer.model.QueryRequest;
import com.saket.queryoptimizer.model.QueryResponse;
import com.saket.queryoptimizer.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/query")
@CrossOrigin
public class QueryController {

    @Autowired
    private QueryService queryService;

    @PostMapping("/analyze")
    public QueryResponse analyzeQuery(@RequestBody QueryRequest request) {

        return queryService.analyzeQuery(request.getQuery());
    }

    @PostMapping("/optimize")
    public QueryResponse optimizeQuery(@RequestBody QueryRequest request) {

        return queryService.optimizeQuery(request.getQuery());

    }
    @PostMapping("/compare")
    public QueryComparisonResponse compareQuery(@RequestBody QueryRequest request) {

        return queryService.compareQueries(request.getQuery());

    }

}