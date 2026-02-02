package com.eduportal.controller;

import com.eduportal.dto.request.StudentClassRequest;
import com.eduportal.dto.response.ApiResponse;
import com.eduportal.dto.response.StudentClassResponse;
import com.eduportal.entity.User;
import com.eduportal.service.StudentClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-classes")
@RequiredArgsConstructor
public class StudentClassController {
    private final StudentClassService studentClassService;

    @GetMapping("/my-classes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentClassResponse>>> getMyClasses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(studentClassService.getStudentClasses(user.getId())));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentClassResponse>>> getStudentClasses(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success(studentClassService.getStudentClasses(studentId)));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentClassResponse>>> getClassStudents(@PathVariable UUID classId) {
        return ResponseEntity.ok(ApiResponse.success(studentClassService.getClassStudents(classId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentClassResponse>> enrollStudent(@Valid @RequestBody StudentClassRequest request) {
        StudentClassResponse response = studentClassService.enrollStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> unenrollStudent(@PathVariable UUID id) {
        studentClassService.unenrollStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student unenrolled", null));
    }

    @DeleteMapping("/student/{studentId}/class/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> unenrollStudentFromClass(
            @PathVariable UUID studentId,
            @PathVariable UUID classId) {
        studentClassService.unenrollStudentFromClass(studentId, classId);
        return ResponseEntity.ok(ApiResponse.success("Student unenrolled from class", null));
    }
}
