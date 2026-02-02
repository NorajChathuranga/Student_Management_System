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
public class ClassResponse {
    private UUID id;
    private String name;
    private String description;
    private String gradeLevel;
    private String academicYear;
    private Long studentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
