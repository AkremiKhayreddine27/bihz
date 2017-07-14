package com.ihz.repositories;


import com.ihz.models.Qualitatif;
import com.ihz.models.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StatisticsRepository extends JpaRepository<Statistic, Integer> {

    @Query("SELECT DISTINCT s.type FROM Statistic s")
    public List<Statistic> findDistinctByType();

    @Query("SELECT DISTINCT s.nappe FROM Statistic s WHERE s.type = :type")
    public List<Statistic> findDistinctNappeBytype(@Param("type") String type);



    @Query("SELECT DISTINCT s.date FROM Statistic s WHERE s.type = :type")
    public List<Statistic> findDistinctByDate(@Param("type") String type);


    public List<Statistic> findByNappeAndType(String nappe, String type);

    public List<Statistic> findByType(String type);

}
