package com.eduportal.service;

import com.eduportal.dto.request.StudentClassRequest;
import com.eduportal.dto.response.StudentClassResponse;
import com.eduportal.entity.AppRole;
import com.eduportal.entity.SchoolClass;
import com.eduportal.entity.StudentClass;
import com.eduportal.entity.User;
import com.eduportal.exception.BadRequestException;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.StudentClassRepository;
import com.eduportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentClassService {
    private final StudentClassRepository studentClassRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;

    public List<StudentClassResponse> getStudentClasses(UUID studentId) {
        return studentClassRepository.findByStudentIdWithClass(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StudentClassResponse> getClassStudents(UUID classId) {
        return studentClassRepository.findByClassIdWithStudent(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentClassResponse enrollStudent(StudentClassRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != AppRole.STUDENT) {
            throw new BadRequestException("User is not a student");
        }

        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        if (studentClassRepository.existsByStudentIdAndSchoolClassId(request.getStudentId(), request.getClassId())) {
            throw new BadRequestException("Student is already enrolled in this class");
        }

        StudentClass studentClass = StudentClass.builder()
                .student(student)
                .schoolClass(schoolClass)
                .build();

        studentClass = studentClassRepository.save(studentClass);
        return mapToResponse(studentClass);
    }

    @Transactional
    public void unenrollStudent(UUID id) {
        if (!studentClassRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student enrollment not found");
        }
        studentClassRepository.deleteById(id);
    }

    @Transactional
    public void unenrollStudentFromClass(UUID studentId, UUID classId) {
        StudentClass studentClass = studentClassRepository.findByStudentIdAndSchoolClassId(studentId, classId)
                .orElseThrow(() -> new ResourceNotFoundException("Student enrollment not found"));
        studentClassRepository.delete(studentClass);
    }

    private StudentClassResponse mapToResponse(StudentClass sc) {
        return StudentClassResponse.builder()
                .id(sc.getId())
                .studentId(sc.getStudent().getId())
                .studentName(sc.getStudent().getFullName())
                .studentEmail(sc.getStudent().getEmail())
                .classId(sc.getSchoolClass().getId())
                .className(sc.getSchoolClass().getName())
                .gradeLevel(sc.getSchoolClass().getGradeLevel())
                .enrolledAt(sc.getEnrolledAt())
                .student(StudentClassResponse.StudentInfo.builder()
                        .id(sc.getStudent().getId())
                        .fullName(sc.getStudent().getFullName())
                        .email(sc.getStudent().getEmail())
                        .build())
                .schoolClass(StudentClassResponse.ClassInfo.builder()
                        .id(sc.getSchoolClass().getId())
                        .name(sc.getSchoolClass().getName())
                        .gradeLevel(sc.getSchoolClass().getGradeLevel())
                        .description(sc.getSchoolClass().getDescription())
                        .academicYear(sc.getSchoolClass().getAcademicYear())
                        .build())
                .build();
    }
}
