package com.eduportal.repository;

import com.eduportal.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, UUID> {
    List<SchoolClass> findByAcademicYear(String academicYear);
    
    @Query("SELECT c FROM SchoolClass c ORDER BY c.name ASC")
    List<SchoolClass> findAllOrderByName();
    
    boolean existsByNameAndAcademicYear(String name, String academicYear);
}
