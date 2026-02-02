package com.eduportal.repository;

import com.eduportal.entity.TeacherClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeacherClassRepository extends JpaRepository<TeacherClass, UUID> {
    List<TeacherClass> findByTeacherId(UUID teacherId);
    
    List<TeacherClass> findBySchoolClassId(UUID classId);
    
    @Query("SELECT tc FROM TeacherClass tc JOIN FETCH tc.schoolClass JOIN FETCH tc.subject WHERE tc.teacher.id = :teacherId")
    List<TeacherClass> findByTeacherIdWithDetails(UUID teacherId);
    
    boolean existsByTeacherIdAndSchoolClassIdAndSubjectId(UUID teacherId, UUID classId, UUID subjectId);
    
    void deleteByTeacherIdAndSchoolClassId(UUID teacherId, UUID classId);
}
