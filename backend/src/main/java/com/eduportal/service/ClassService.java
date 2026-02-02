package com.eduportal.service;

import com.eduportal.dto.request.ClassRequest;
import com.eduportal.dto.response.ClassResponse;
import com.eduportal.entity.SchoolClass;
import com.eduportal.exception.BadRequestException;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {
    private final SchoolClassRepository classRepository;
    private final StudentClassRepository studentClassRepository;

    public List<ClassResponse> getAllClasses() {
        return classRepository.findAllOrderByName().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClassResponse getClassById(UUID id) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        return mapToResponse(schoolClass);
    }

    @Transactional
    public ClassResponse createClass(ClassRequest request) {
        String academicYear = request.getAcademicYear() != null ? request.getAcademicYear() : "2024-2025";
        
        if (classRepository.existsByNameAndAcademicYear(request.getName(), academicYear)) {
            throw new BadRequestException("Class with this name already exists for this academic year");
        }

        SchoolClass schoolClass = SchoolClass.builder()
                .name(request.getName())
                .description(request.getDescription())
                .gradeLevel(request.getGradeLevel())
                .academicYear(academicYear)
                .build();

        schoolClass = classRepository.save(schoolClass);
        return mapToResponse(schoolClass);
    }

    @Transactional
    public ClassResponse updateClass(UUID id, ClassRequest request) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        schoolClass.setName(request.getName());
        schoolClass.setDescription(request.getDescription());
        schoolClass.setGradeLevel(request.getGradeLevel());
        if (request.getAcademicYear() != null) {
            schoolClass.setAcademicYear(request.getAcademicYear());
        }

        schoolClass = classRepository.save(schoolClass);
        return mapToResponse(schoolClass);
    }

    @Transactional
    public void deleteClass(UUID id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found");
        }
        classRepository.deleteById(id);
    }

    public long countClasses() {
        return classRepository.count();
    }

    private ClassResponse mapToResponse(SchoolClass schoolClass) {
        long studentCount = studentClassRepository.countByClassId(schoolClass.getId());
        return ClassResponse.builder()
                .id(schoolClass.getId())
                .name(schoolClass.getName())
                .description(schoolClass.getDescription())
                .gradeLevel(schoolClass.getGradeLevel())
                .academicYear(schoolClass.getAcademicYear())
                .studentCount(studentCount)
                .createdAt(schoolClass.getCreatedAt())
                .updatedAt(schoolClass.getUpdatedAt())
                .build();
    }
}
