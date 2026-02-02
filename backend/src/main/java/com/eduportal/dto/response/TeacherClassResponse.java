package com.eduportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherClassResponse {
    private UUID id;
    private UUID teacherId;
    private String teacherName;
    private String teacherEmail;
    private UUID classId;
    private String className;
    private UUID subjectId;
    private String subjectName;
    private Long studentCount;
    private LocalDateTime createdAt;
    
    // Nested objects for frontend compatibility
    private TeacherInfo teacher;
    private ClassInfo schoolClass;
    private SubjectInfo subject;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherInfo {
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
        private String gradeLevel;
        private String description;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectInfo {
        private UUID id;
        private String name;
        private String code;
    }
}
