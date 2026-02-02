package com.eduportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClassRequest {
    @NotBlank(message = "Class name is required")
    private String name;
    
    private String description;
    
    private String gradeLevel;
    
    private String academicYear;
}
