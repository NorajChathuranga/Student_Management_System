package com.eduportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubjectRequest {
    @NotBlank(message = "Subject name is required")
    private String name;
    
    private String code;
    
    private String description;
}
