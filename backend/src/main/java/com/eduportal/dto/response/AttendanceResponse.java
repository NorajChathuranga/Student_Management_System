package com.eduportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private UUID classId;
    private String className;
    private LocalDate date;
    private String status;
    private String notes;
    private UUID markedById;
    private String markedByName;
    private LocalDateTime createdAt;
    
    // Nested objects for frontend compatibility
    private StudentInfo student;
    private ClassInfo schoolClass;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String fullName;
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassInfo {
        private UUID id;
        private String name;
    }
}
