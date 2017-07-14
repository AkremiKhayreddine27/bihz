package com.ihz.services;

import com.ihz.models.Statistic;
import com.ihz.repositories.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by Khayreddine on 12/05/2017.
 */
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Override
    public List<Statistic> getTypes() {
        List<Statistic> statistics = statisticsRepository.findDistinctByType();
        return statistics;
    }
}
