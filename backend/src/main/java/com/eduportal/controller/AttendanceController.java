package com.eduportal.controller;

import com.eduportal.dto.request.AttendanceRequest;
import com.eduportal.dto.response.ApiResponse;
import com.eduportal.dto.response.AttendanceResponse;
import com.eduportal.dto.response.AttendanceStats;
import com.eduportal.entity.User;
import com.eduportal.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping("/my-attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getMyAttendance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendance(user.getId())));
    }

    @GetMapping("/my-stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<AttendanceStats>> getMyStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceStats(user.getId())));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getStudentAttendance(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendance(studentId)));
    }

    @GetMapping("/student/{studentId}/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<AttendanceStats>> getStudentStats(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceStats(studentId)));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getClassAttendance(
            @PathVariable UUID classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getClassAttendance(classId, date)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<AttendanceResponse>> markAttendance(
            @Valid @RequestBody AttendanceRequest request,
            @AuthenticationPrincipal User user) {
        AttendanceResponse response = attendanceService.markAttendance(request, user);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked", response));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> markBulkAttendance(
            @Valid @RequestBody List<AttendanceRequest> requests,
            @AuthenticationPrincipal User user) {
        List<AttendanceResponse> responses = attendanceService.markBulkAttendanceFromList(requests, user);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked for " + responses.size() + " students", responses));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable UUID id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success("Attendance record deleted", null));
    }
}
