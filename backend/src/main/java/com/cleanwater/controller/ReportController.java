package com.cleanwater.controller;

import com.cleanwater.dto.ReportRequest;
import com.cleanwater.dto.StatusUpdateRequest;
import com.cleanwater.model.Report;
import com.cleanwater.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        Optional<Report> report = reportService.getReportById(id);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reporter/{reporter}")
    public ResponseEntity<List<Report>> getReportsByReporter(@PathVariable String reporter) {
        return ResponseEntity.ok(reportService.getReportsByReporter(reporter));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Report>> getReportsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Report>> getReportsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(reportService.getReportsBySeverity(severity));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Report>> getReportsByType(@PathVariable String type) {
        return ResponseEntity.ok(reportService.getReportsByType(type));
    }

    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportRequest reportRequest) {
        try {
            Report report = new Report();
            report.setTitle(reportRequest.getTitle());
            report.setDetails(reportRequest.getDetails());
            report.setType(reportRequest.getType());
            report.setSeverity(reportRequest.getSeverity());
            report.setLocation(reportRequest.getLocation());
            report.setLatitude(reportRequest.getLatitude());
            report.setLongitude(reportRequest.getLongitude());
            report.setReporter(reportRequest.getReporterName());
            report.setTags(reportRequest.getTags());
            report.setStatus(reportRequest.getStatus() != null ? reportRequest.getStatus() : "Pending Review");

            Report createdReport = reportService.createReport(report);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReport(@PathVariable Long id, @Valid @RequestBody Report report) {
        try {
            Report updatedReport = reportService.updateReport(id, report);
            return ResponseEntity.ok(updatedReport);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest statusUpdate) {
        try {
            Report updatedReport = reportService.updateReportStatus(
                    id,
                    statusUpdate.getStatus(),
                    statusUpdate.getSeverity()
            );
            return ResponseEntity.ok(updatedReport);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Report deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReportStats() {
        List<Report> allReports = reportService.getAllReports();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", allReports.size());
        stats.put("pending", allReports.stream().filter(r -> "Pending Review".equals(r.getStatus())).count());
        stats.put("inProgress", allReports.stream().filter(r -> "In Progress".equals(r.getStatus())).count());
        stats.put("resolved", allReports.stream().filter(r -> "Resolved".equals(r.getStatus())).count());
        stats.put("critical", allReports.stream().filter(r -> "Critical".equals(r.getSeverity())).count());
        stats.put("high", allReports.stream().filter(r -> "High".equals(r.getSeverity())).count());
        
        return ResponseEntity.ok(stats);
    }
}
