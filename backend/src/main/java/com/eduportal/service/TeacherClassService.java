package com.eduportal.service;

import com.eduportal.dto.request.TeacherClassRequest;
import com.eduportal.dto.response.TeacherClassResponse;
import com.eduportal.entity.AppRole;
import com.eduportal.entity.SchoolClass;
import com.eduportal.entity.Subject;
import com.eduportal.entity.TeacherClass;
import com.eduportal.entity.User;
import com.eduportal.exception.BadRequestException;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.StudentClassRepository;
import com.eduportal.repository.SubjectRepository;
import com.eduportal.repository.TeacherClassRepository;
import com.eduportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherClassService {
    private final TeacherClassRepository teacherClassRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final StudentClassRepository studentClassRepository;

    public List<TeacherClassResponse> getTeacherClasses(UUID teacherId) {
        return teacherClassRepository.findByTeacherIdWithDetails(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TeacherClassResponse> getClassTeachers(UUID classId) {
        return teacherClassRepository.findBySchoolClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeacherClassResponse assignTeacherToClass(TeacherClassRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if (teacher.getRole() != AppRole.TEACHER) {
            throw new BadRequestException("User is not a teacher");
        }

        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        }

        if (teacherClassRepository.existsByTeacherIdAndSchoolClassIdAndSubjectId(
                request.getTeacherId(), request.getClassId(), request.getSubjectId())) {
            throw new BadRequestException("Teacher is already assigned to this class and subject");
        }

        TeacherClass teacherClass = TeacherClass.builder()
                .teacher(teacher)
                .schoolClass(schoolClass)
                .subject(subject)
                .build();

        teacherClass = teacherClassRepository.save(teacherClass);
        return mapToResponse(teacherClass);
    }

    @Transactional
    public void removeTeacherFromClass(UUID id) {
        if (!teacherClassRepository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher class assignment not found");
        }
        teacherClassRepository.deleteById(id);
    }

    private TeacherClassResponse mapToResponse(TeacherClass tc) {
        long studentCount = studentClassRepository.countByClassId(tc.getSchoolClass().getId());
        return TeacherClassResponse.builder()
                .id(tc.getId())
                .teacherId(tc.getTeacher().getId())
                .teacherName(tc.getTeacher().getFullName())
                .teacherEmail(tc.getTeacher().getEmail())
                .classId(tc.getSchoolClass().getId())
                .className(tc.getSchoolClass().getName())
                .subjectId(tc.getSubject() != null ? tc.getSubject().getId() : null)
                .subjectName(tc.getSubject() != null ? tc.getSubject().getName() : null)
                .studentCount(studentCount)
                .createdAt(tc.getCreatedAt())
                .teacher(TeacherClassResponse.TeacherInfo.builder()
                        .id(tc.getTeacher().getId())
                        .fullName(tc.getTeacher().getFullName())
                        .email(tc.getTeacher().getEmail())
                        .build())
                .schoolClass(TeacherClassResponse.ClassInfo.builder()
                        .id(tc.getSchoolClass().getId())
                        .name(tc.getSchoolClass().getName())
                        .gradeLevel(tc.getSchoolClass().getGradeLevel())
                        .description(tc.getSchoolClass().getDescription())
                        .build())
                .subject(tc.getSubject() != null ? TeacherClassResponse.SubjectInfo.builder()
                        .id(tc.getSubject().getId())
                        .name(tc.getSubject().getName())
                        .code(tc.getSubject().getCode())
                        .build() : null)
                .build();
    }
}
