package com.cleanwater.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Severity is required")
    private String severity;
}
