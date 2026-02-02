package com.eduportal.controller;

import com.eduportal.dto.request.TeacherClassRequest;
import com.eduportal.dto.response.ApiResponse;
import com.eduportal.dto.response.TeacherClassResponse;
import com.eduportal.entity.User;
import com.eduportal.service.TeacherClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teacher-classes")
@RequiredArgsConstructor
public class TeacherClassController {
    private final TeacherClassService teacherClassService;

    @GetMapping("/my-classes")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<TeacherClassResponse>>> getMyClasses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(teacherClassService.getTeacherClasses(user.getId())));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<TeacherClassResponse>>> getTeacherClasses(@PathVariable UUID teacherId) {
        return ResponseEntity.ok(ApiResponse.success(teacherClassService.getTeacherClasses(teacherId)));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TeacherClassResponse>>> getClassTeachers(@PathVariable UUID classId) {
        return ResponseEntity.ok(ApiResponse.success(teacherClassService.getClassTeachers(classId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherClassResponse>> assignTeacher(@Valid @RequestBody TeacherClassRequest request) {
        TeacherClassResponse response = teacherClassService.assignTeacherToClass(request);
        return ResponseEntity.ok(ApiResponse.success("Teacher assigned successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeTeacher(@PathVariable UUID id) {
        teacherClassService.removeTeacherFromClass(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher removed from class", null));
    }
}
