package com.eduportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private UUID classId;
    private String className;
    private UUID subjectId;
    private String subjectName;
    private String examType;
    private BigDecimal score;
    private BigDecimal maxScore;
    private Double percentage;
    private String grade;
    private LocalDate examDate;
    private String notes;
    private UUID gradedById;
    private String gradedByName;
    private LocalDateTime createdAt;
    
    // Nested objects for frontend compatibility
    private SubjectInfo subject;
    private ClassInfo schoolClass;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectInfo {
        private UUID id;
        private String name;
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
