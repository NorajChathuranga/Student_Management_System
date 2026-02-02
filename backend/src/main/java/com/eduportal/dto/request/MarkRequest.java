package com.eduportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class MarkRequest {
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    
    @NotNull(message = "Class ID is required")
    private UUID classId;
    
    @NotNull(message = "Subject ID is required")
    private UUID subjectId;
    
    @NotBlank(message = "Exam type is required")
    private String examType; // Quiz, Assignment, Midterm, Final, Project
    
    @NotNull(message = "Score is required")
    private BigDecimal score;
    
    private BigDecimal maxScore;
    
    private LocalDate examDate;
    
    private String notes;
}
