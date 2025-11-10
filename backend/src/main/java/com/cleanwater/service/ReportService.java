package com.cleanwater.service;

import com.cleanwater.model.Report;
import com.cleanwater.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    public List<Report> getReportsByReporter(String reporter) {
        return reportRepository.findByReporter(reporter);
    }

    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status);
    }

    public List<Report> getReportsBySeverity(String severity) {
        return reportRepository.findBySeverity(severity);
    }

    public List<Report> getReportsByType(String type) {
        return reportRepository.findByType(type);
    }

    public Report createReport(Report report) {
        // Status is automatically set to "Pending Review" by default
        if (report.getStatus() == null || report.getStatus().isEmpty()) {
            report.setStatus("Pending Review");
        }
        return reportRepository.save(report);
    }

    public Report updateReport(Long id, Report reportDetails) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        report.setTitle(reportDetails.getTitle());
        report.setDetails(reportDetails.getDetails());
        report.setType(reportDetails.getType());
        report.setSeverity(reportDetails.getSeverity());
        report.setStatus(reportDetails.getStatus());
        report.setLocation(reportDetails.getLocation());
        report.setTags(reportDetails.getTags());

        return reportRepository.save(report);
    }

    public Report updateReportStatus(Long id, String status, String severity) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        report.setStatus(status);
        report.setSeverity(severity);

        return reportRepository.save(report);
    }

    public void deleteReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        reportRepository.delete(report);
    }
}
