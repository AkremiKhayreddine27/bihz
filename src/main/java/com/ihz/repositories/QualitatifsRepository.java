package com.ihz.repositories;

import com.ihz.models.Qualitatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QualitatifsRepository extends JpaRepository<Qualitatif, Integer> {

    @Query("SELECT DISTINCT s.type FROM Qualitatif s")
    public List<Qualitatif> findDistinctByType();

    @Query("SELECT DISTINCT s.nappe FROM Qualitatif s WHERE s.type = :type")
    public List<Qualitatif> findDistinctNappeBytype(@Param("type") String type);

    @Query("SELECT DISTINCT s.date FROM Qualitatif s WHERE s.type = :type")
    public List<Qualitatif> findDistinctByDate(@Param("type") String type);


    public List<Qualitatif> findByNappeAndType(String nappe, String type);

    public List<Qualitatif> findByTypeOrderByDateAsc(String type);

}