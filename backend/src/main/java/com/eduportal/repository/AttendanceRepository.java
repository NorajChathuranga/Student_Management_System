package com.eduportal.repository;

import com.eduportal.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByStudentId(UUID studentId);
    
    List<Attendance> findBySchoolClassId(UUID classId);
    
    List<Attendance> findBySchoolClassIdAndDate(UUID classId, LocalDate date);
    
    @Query("SELECT a FROM Attendance a JOIN FETCH a.student JOIN FETCH a.schoolClass WHERE a.student.id = :studentId ORDER BY a.date DESC")
    List<Attendance> findByStudentIdWithDetails(UUID studentId);
    
    @Query("SELECT a FROM Attendance a JOIN FETCH a.student WHERE a.schoolClass.id = :classId AND a.date = :date")
    List<Attendance> findByClassIdAndDateWithStudent(UUID classId, LocalDate date);
    
    Optional<Attendance> findByStudentIdAndSchoolClassIdAndDate(UUID studentId, UUID classId, LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = :status")
    long countByStudentIdAndStatus(UUID studentId, String status);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countByStudentId(UUID studentId);
}
