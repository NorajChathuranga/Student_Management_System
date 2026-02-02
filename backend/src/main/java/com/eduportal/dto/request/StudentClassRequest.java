package com.eduportal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StudentClassRequest {
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    
    @NotNull(message = "Class ID is required")
    private UUID classId;
}
