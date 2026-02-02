package com.eduportal.service;

import com.eduportal.dto.response.DashboardStats;
import com.eduportal.entity.AppRole;
import com.eduportal.repository.SchoolClassRepository;
import com.eduportal.repository.SubjectRepository;
import com.eduportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;
    private final SubjectRepository subjectRepository;

    public DashboardStats getStats() {
        return DashboardStats.builder()
                .totalStudents(userRepository.countByRole(AppRole.STUDENT))
                .totalTeachers(userRepository.countByRole(AppRole.TEACHER))
                .totalClasses(classRepository.count())
                .totalSubjects(subjectRepository.count())
                .build();
    }
}
