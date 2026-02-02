package com.eduportal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TeacherClassRequest {
    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;
    
    @NotNull(message = "Class ID is required")
    private UUID classId;
    
    private UUID subjectId;
}
