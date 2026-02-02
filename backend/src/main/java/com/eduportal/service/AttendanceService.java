package com.eduportal.service;

import com.eduportal.dto.request.AttendanceRequest;
import com.eduportal.dto.request.BulkAttendanceRequest;
import com.eduportal.dto.response.AttendanceResponse;
import com.eduportal.dto.response.AttendanceStats;
import com.eduportal.entity.Attendance;
import com.eduportal.entity.SchoolClass;
import com.eduportal.entity.User;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.AttendanceRepository;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;

    public List<AttendanceResponse> getStudentAttendance(UUID studentId) {
        return attendanceRepository.findByStudentIdWithDetails(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getClassAttendance(UUID classId, LocalDate date) {
        return attendanceRepository.findByClassIdAndDateWithStudent(classId, date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request, User markedBy) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        // Check if attendance already exists for this student, class, and date
        Optional<Attendance> existing = attendanceRepository
                .findByStudentIdAndSchoolClassIdAndDate(request.getStudentId(), request.getClassId(), request.getDate());

        Attendance attendance;
        if (existing.isPresent()) {
            // Update existing
            attendance = existing.get();
            attendance.setStatus(request.getStatus());
            attendance.setNotes(request.getNotes());
            attendance.setMarkedBy(markedBy);
        } else {
            // Create new
            attendance = Attendance.builder()
                    .student(student)
                    .schoolClass(schoolClass)
                    .date(request.getDate())
                    .status(request.getStatus())
                    .notes(request.getNotes())
                    .markedBy(markedBy)
                    .build();
        }

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Transactional
    public List<AttendanceResponse> markBulkAttendance(BulkAttendanceRequest request, User markedBy) {
        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        List<AttendanceResponse> responses = new ArrayList<>();

        for (BulkAttendanceRequest.AttendanceRecord record : request.getRecords()) {
            User student = userRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + record.getStudentId()));

            Optional<Attendance> existing = attendanceRepository
                    .findByStudentIdAndSchoolClassIdAndDate(record.getStudentId(), request.getClassId(), request.getDate());

            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(record.getStatus());
                attendance.setNotes(record.getNotes());
                attendance.setMarkedBy(markedBy);
            } else {
                attendance = Attendance.builder()
                        .student(student)
                        .schoolClass(schoolClass)
                        .date(request.getDate())
                        .status(record.getStatus())
                        .notes(record.getNotes())
                        .markedBy(markedBy)
                        .build();
            }

            attendance = attendanceRepository.save(attendance);
            responses.add(mapToResponse(attendance));
        }

        return responses;
    }

    @Transactional
    public List<AttendanceResponse> markBulkAttendanceFromList(List<AttendanceRequest> requests, User markedBy) {
        List<AttendanceResponse> responses = new ArrayList<>();

        for (AttendanceRequest request : requests) {
            responses.add(markAttendance(request, markedBy));
        }

        return responses;
    }

    public AttendanceStats getStudentAttendanceStats(UUID studentId) {
        long total = attendanceRepository.countByStudentId(studentId);
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, "present");
        long absent = attendanceRepository.countByStudentIdAndStatus(studentId, "absent");
        long late = attendanceRepository.countByStudentIdAndStatus(studentId, "late");
        long excused = attendanceRepository.countByStudentIdAndStatus(studentId, "excused");

        double percentage = total > 0 ? ((double) (present + late) / total) * 100 : 0;

        return AttendanceStats.builder()
                .totalDays(total)
                .presentDays(present)
                .absentDays(absent)
                .lateDays(late)
                .excusedDays(excused)
                .attendancePercentage(Math.round(percentage * 100.0) / 100.0)
                .build();
    }

    @Transactional
    public void deleteAttendance(UUID id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found");
        }
        attendanceRepository.deleteById(id);
    }

    private AttendanceResponse mapToResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getFullName())
                .studentEmail(a.getStudent().getEmail())
                .classId(a.getSchoolClass().getId())
                .className(a.getSchoolClass().getName())
                .date(a.getDate())
                .status(a.getStatus())
                .notes(a.getNotes())
                .markedById(a.getMarkedBy() != null ? a.getMarkedBy().getId() : null)
                .markedByName(a.getMarkedBy() != null ? a.getMarkedBy().getFullName() : null)
                .createdAt(a.getCreatedAt())
                .student(AttendanceResponse.StudentInfo.builder()
                        .id(a.getStudent().getId())
                        .fullName(a.getStudent().getFullName())
                        .email(a.getStudent().getEmail())
                        .build())
                .schoolClass(AttendanceResponse.ClassInfo.builder()
                        .id(a.getSchoolClass().getId())
                        .name(a.getSchoolClass().getName())
                        .build())
                .build();
    }
}
