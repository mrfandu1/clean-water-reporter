package com.cleanwater.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Details are required")
    private String details;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Severity is required")
    private String severity;

    @NotBlank(message = "Location is required")
    private String location;

    private Double latitude;
    
    private Double longitude;

    @NotBlank(message = "Reporter name is required")
    private String reporterName;

    private String tags;
    
    private String dateReported;
    
    private String lastUpdated;
    
    private String status;
}
