package com.eduportal.service;

import com.eduportal.dto.request.SubjectRequest;
import com.eduportal.dto.response.SubjectResponse;
import com.eduportal.entity.Subject;
import com.eduportal.exception.BadRequestException;
import com.eduportal.exception.ResourceNotFoundException;
import com.eduportal.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SubjectResponse getSubjectById(UUID id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        return mapToResponse(subject);
    }

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        if (request.getCode() != null && subjectRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Subject with this code already exists");
        }

        Subject subject = Subject.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .build();

        subject = subjectRepository.save(subject);
        return mapToResponse(subject);
    }

    @Transactional
    public SubjectResponse updateSubject(UUID id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subject.setDescription(request.getDescription());

        subject = subjectRepository.save(subject);
        return mapToResponse(subject);
    }

    @Transactional
    public void deleteSubject(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found");
        }
        subjectRepository.deleteById(id);
    }

    public long countSubjects() {
        return subjectRepository.count();
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .code(subject.getCode())
                .description(subject.getDescription())
                .createdAt(subject.getCreatedAt())
                .build();
    }
}
