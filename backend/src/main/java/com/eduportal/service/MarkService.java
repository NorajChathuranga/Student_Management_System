package com.eduportal.service;

import com.eduportal.dto.request.MarkRequest;
import com.eduportal.dto.response.MarkResponse;
import com.eduportal.entity.Mark;
import com.eduportal.entity.SchoolClass;
import com.eduportal.entity.Subject;
import com.eduportal.entity.User;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.MarkRepository;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.SubjectRepository;
import com.eduportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarkService {
    private final MarkRepository markRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;
    private final SubjectRepository subjectRepository;

    public List<MarkResponse> getStudentMarks(UUID studentId) {
        return markRepository.findByStudentIdWithDetails(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MarkResponse> getClassSubjectMarks(UUID classId, UUID subjectId) {
        return markRepository.findByClassIdAndSubjectIdWithStudent(classId, subjectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MarkResponse addMark(MarkRequest request, User gradedBy) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        BigDecimal maxScore = request.getMaxScore() != null ? request.getMaxScore() : new BigDecimal("100");
        LocalDate examDate = request.getExamDate() != null ? request.getExamDate() : LocalDate.now();

        Mark mark = Mark.builder()
                .student(student)
                .schoolClass(schoolClass)
                .subject(subject)
                .examType(request.getExamType())
                .score(request.getScore())
                .maxScore(maxScore)
                .examDate(examDate)
                .notes(request.getNotes())
                .gradedBy(gradedBy)
                .build();

        mark = markRepository.save(mark);
        return mapToResponse(mark);
    }

    @Transactional
    public List<MarkResponse> addBulkMarks(List<MarkRequest> requests, User gradedBy) {
        return requests.stream()
                .map(request -> addMark(request, gradedBy))
                .collect(Collectors.toList());
    }

    @Transactional
    public MarkResponse updateMark(UUID id, MarkRequest request, User gradedBy) {
        Mark mark = markRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mark not found"));

        mark.setExamType(request.getExamType());
        mark.setScore(request.getScore());
        if (request.getMaxScore() != null) {
            mark.setMaxScore(request.getMaxScore());
        }
        if (request.getExamDate() != null) {
            mark.setExamDate(request.getExamDate());
        }
        mark.setNotes(request.getNotes());
        mark.setGradedBy(gradedBy);

        mark = markRepository.save(mark);
        return mapToResponse(mark);
    }

    @Transactional
    public void deleteMark(UUID id) {
        if (!markRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mark not found");
        }
        markRepository.deleteById(id);
    }

    public Double getStudentAverage(UUID studentId) {
        return markRepository.getAverageScoreByStudentId(studentId);
    }

    public Double getClassSubjectAverage(UUID classId, UUID subjectId) {
        return markRepository.getAverageScoreByClassAndSubject(classId, subjectId);
    }

    private MarkResponse mapToResponse(Mark m) {
        double percentage = m.getScore().divide(m.getMaxScore(), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100")).doubleValue();
        String grade = calculateGrade(percentage);

        return MarkResponse.builder()
                .id(m.getId())
                .studentId(m.getStudent().getId())
                .studentName(m.getStudent().getFullName())
                .studentEmail(m.getStudent().getEmail())
                .classId(m.getSchoolClass().getId())
                .className(m.getSchoolClass().getName())
                .subjectId(m.getSubject().getId())
                .subjectName(m.getSubject().getName())
                .examType(m.getExamType())
                .score(m.getScore())
                .maxScore(m.getMaxScore())
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .grade(grade)
                .examDate(m.getExamDate())
                .notes(m.getNotes())
                .gradedById(m.getGradedBy() != null ? m.getGradedBy().getId() : null)
                .gradedByName(m.getGradedBy() != null ? m.getGradedBy().getFullName() : null)
                .createdAt(m.getCreatedAt())
                .subject(MarkResponse.SubjectInfo.builder()
                        .id(m.getSubject().getId())
                        .name(m.getSubject().getName())
                        .build())
                .schoolClass(MarkResponse.ClassInfo.builder()
                        .id(m.getSchoolClass().getId())
                        .name(m.getSchoolClass().getName())
                        .build())
                .build();
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 85) return "A";
        if (percentage >= 80) return "A-";
        if (percentage >= 75) return "B+";
        if (percentage >= 70) return "B";
        if (percentage >= 65) return "B-";
        if (percentage >= 60) return "C+";
        if (percentage >= 55) return "C";
        if (percentage >= 50) return "C-";
        if (percentage >= 45) return "D";
        return "F";
    }
}
