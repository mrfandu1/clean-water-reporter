package com.cleanwater.repository;

import com.cleanwater.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReporter(String reporter);
    List<Report> findByStatus(String status);
    List<Report> findBySeverity(String severity);
    List<Report> findByType(String type);
    List<Report> findByOrderByLastUpdatedDesc();
}
