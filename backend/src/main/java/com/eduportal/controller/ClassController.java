package com.eduportal.controller;

import com.eduportal.dto.request.ClassRequest;
import com.eduportal.dto.response.ApiResponse;
import com.eduportal.dto.response.ClassResponse;
import com.eduportal.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassResponse>>> getAllClasses() {
        return ResponseEntity.ok(ApiResponse.success(classService.getAllClasses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassResponse>> getClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(classService.getClassById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassResponse>> createClass(@Valid @RequestBody ClassRequest request) {
        ClassResponse response = classService.createClass(request);
        return ResponseEntity.ok(ApiResponse.success("Class created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassResponse>> updateClass(
            @PathVariable UUID id,
            @Valid @RequestBody ClassRequest request) {
        ClassResponse response = classService.updateClass(id, request);
        return ResponseEntity.ok(ApiResponse.success("Class updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClass(@PathVariable UUID id) {
        classService.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.success("Class deleted successfully", null));
    }
}
