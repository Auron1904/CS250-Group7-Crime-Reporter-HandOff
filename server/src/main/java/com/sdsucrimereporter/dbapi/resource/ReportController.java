package com.sdsucrimereporter.dbapi.resource;

import com.sdsucrimereporter.dbapi.domain.Report;
import com.sdsucrimereporter.dbapi.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<Report> createReport(
            @RequestBody Report report,
            Authentication authentication) {

        System.out.println("=== CREATE REPORT REQUEST RECEIVED ===");
        System.out.println("Report data: " + report);
        System.out.println("Authenticated user: " + authentication.getName());

        String reporterId = authentication.getName();
        report.setReporterId(reporterId);

        Report savedReport = reportService.createReport(report);

        System.out.println("Report saved with ID: " + savedReport.getReportId());

        return ResponseEntity.created(URI.create("/api/reports/" + savedReport.getReportId()))
                .body(savedReport);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        System.out.println("=== GET ALL REPORTS REQUEST ===");
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<Report>> getMyReports(Authentication authentication) {
        String reporterId = authentication.getName();
        return ResponseEntity.ok(reportService.getReportsByReporter(reporterId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(@PathVariable String id) {
        return ResponseEntity.ok(reportService.getReport(id));
    }
}