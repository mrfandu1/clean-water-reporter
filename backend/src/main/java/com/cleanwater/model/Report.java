package com.cleanwater.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Details are required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @NotBlank(message = "Type is required")
    @Column(nullable = false)
    private String type; // Quality, Infrastructure, Supply, Drought, Safety

    @NotBlank(message = "Severity is required")
    @Column(nullable = false)
    private String severity; // Critical, High, Medium, Low

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status; // Pending Review, In Progress, Resolved

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @NotBlank(message = "Reporter is required")
    @Column(nullable = false)
    private String reporter;

    @Column(name = "date_reported")
    private String dateReported;

    @Column(name = "last_updated")
    private String lastUpdated;

    @Column(columnDefinition = "TEXT")
    private String tags; // Comma-separated tags

    @PrePersist
    protected void onCreate() {
        String today = java.time.LocalDate.now().toString();
        dateReported = today;
        lastUpdated = today;
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = java.time.LocalDate.now().toString();
    }
}
