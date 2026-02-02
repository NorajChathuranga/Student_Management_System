package com.eduportal.repository;

import com.eduportal.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MarkRepository extends JpaRepository<Mark, UUID> {
    List<Mark> findByStudentId(UUID studentId);
    
    List<Mark> findBySchoolClassId(UUID classId);
    
    List<Mark> findBySchoolClassIdAndSubjectId(UUID classId, UUID subjectId);
    
    @Query("SELECT m FROM Mark m JOIN FETCH m.subject JOIN FETCH m.schoolClass WHERE m.student.id = :studentId ORDER BY m.examDate DESC")
    List<Mark> findByStudentIdWithDetails(UUID studentId);
    
    @Query("SELECT m FROM Mark m JOIN FETCH m.student WHERE m.schoolClass.id = :classId AND m.subject.id = :subjectId")
    List<Mark> findByClassIdAndSubjectIdWithStudent(UUID classId, UUID subjectId);
    
    @Query("SELECT AVG(m.score * 100 / m.maxScore) FROM Mark m WHERE m.student.id = :studentId")
    Double getAverageScoreByStudentId(UUID studentId);
    
    @Query("SELECT AVG(m.score * 100 / m.maxScore) FROM Mark m WHERE m.schoolClass.id = :classId AND m.subject.id = :subjectId")
    Double getAverageScoreByClassAndSubject(UUID classId, UUID subjectId);
}
