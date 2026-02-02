package com.eduportal.repository;

import com.eduportal.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, UUID> {
    List<StudentClass> findByStudentId(UUID studentId);
    
    List<StudentClass> findBySchoolClassId(UUID classId);
    
    @Query("SELECT sc FROM StudentClass sc JOIN FETCH sc.schoolClass WHERE sc.student.id = :studentId")
    List<StudentClass> findByStudentIdWithClass(UUID studentId);
    
    @Query("SELECT sc FROM StudentClass sc JOIN FETCH sc.student WHERE sc.schoolClass.id = :classId")
    List<StudentClass> findByClassIdWithStudent(UUID classId);
    
    @Query("SELECT COUNT(sc) FROM StudentClass sc WHERE sc.schoolClass.id = :classId")
    long countByClassId(UUID classId);
    
    boolean existsByStudentIdAndSchoolClassId(UUID studentId, UUID classId);
    
    Optional<StudentClass> findByStudentIdAndSchoolClassId(UUID studentId, UUID classId);
}
