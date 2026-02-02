package com.eduportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class AttendanceRequest {
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    
    @NotNull(message = "Class ID is required")
    private UUID classId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotBlank(message = "Status is required")
    private String status; // present, absent, late, excused
    
    private String notes;
}
