package com.eduportal.controller;

import com.eduportal.dto.request.MarkRequest;
import com.eduportal.dto.response.ApiResponse;
import com.eduportal.dto.response.MarkResponse;
import com.eduportal.entity.User;
import com.eduportal.service.MarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarkController {
    private final MarkService markService;

    @GetMapping("/my-marks")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> getMyMarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(markService.getStudentMarks(user.getId())));
    }

    @GetMapping("/my-average")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Double>> getMyAverage(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(markService.getStudentAverage(user.getId())));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> getStudentMarks(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success(markService.getStudentMarks(studentId)));
    }

    @GetMapping("/student/{studentId}/average")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Double>> getStudentAverage(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success(markService.getStudentAverage(studentId)));
    }

    @GetMapping("/class/{classId}/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> getClassSubjectMarks(
            @PathVariable UUID classId,
            @PathVariable UUID subjectId) {
        return ResponseEntity.ok(ApiResponse.success(markService.getClassSubjectMarks(classId, subjectId)));
    }

    @GetMapping("/class/{classId}/subject/{subjectId}/average")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Double>> getClassSubjectAverage(
            @PathVariable UUID classId,
            @PathVariable UUID subjectId) {
        return ResponseEntity.ok(ApiResponse.success(markService.getClassSubjectAverage(classId, subjectId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<MarkResponse>> addMark(
            @Valid @RequestBody MarkRequest request,
            @AuthenticationPrincipal User user) {
        MarkResponse response = markService.addMark(request, user);
        return ResponseEntity.ok(ApiResponse.success("Mark added successfully", response));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<MarkResponse>>> addBulkMarks(
            @Valid @RequestBody List<MarkRequest> requests,
            @AuthenticationPrincipal User user) {
        List<MarkResponse> responses = markService.addBulkMarks(requests, user);
        return ResponseEntity.ok(ApiResponse.success("Marks added for " + responses.size() + " students", responses));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<MarkResponse>> updateMark(
            @PathVariable UUID id,
            @Valid @RequestBody MarkRequest request,
            @AuthenticationPrincipal User user) {
        MarkResponse response = markService.updateMark(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Mark updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMark(@PathVariable UUID id) {
        markService.deleteMark(id);
        return ResponseEntity.ok(ApiResponse.success("Mark deleted", null));
    }
}
