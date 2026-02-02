package com.eduportal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class BulkAttendanceRequest {
    @NotNull(message = "Class ID is required")
    private UUID classId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Attendance records are required")
    private List<AttendanceRecord> records;
    
    @Data
    public static class AttendanceRecord {
        @NotNull(message = "Student ID is required")
        private UUID studentId;
        
        @NotNull(message = "Status is required")
        private String status;
        
        private String notes;
    }
}
