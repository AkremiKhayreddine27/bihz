package com.ihz.controllers.api;

import com.ihz.models.Statistic;
import com.ihz.repositories.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsApiController {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Statistic> index() {
        return statisticsRepository.findAll();
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public Statistic store(@RequestBody Statistic statistic) {
        return statisticsRepository.save(statistic);
    }

    @RequestMapping(value = "/getTypes", method = RequestMethod.POST)
    public List<Statistic> getTypes() {
        return statisticsRepository.findDistinctByType();
    }

    @RequestMapping(value = "/getDates", method = RequestMethod.GET)
    public List<Statistic> getDates(@RequestParam String type) {
        return statisticsRepository.findDistinctByDate(type);
    }

    @RequestMapping(value = "/getNappesWithType", method = RequestMethod.GET)
    public List<Statistic> getNappesWithType(@RequestParam String type) {
        return statisticsRepository.findDistinctNappeBytype(type);
    }

    @RequestMapping(value = "/getData", method = RequestMethod.GET)
    public List<Statistic> getData(@RequestParam String type, @RequestParam String nappe) {

        if(nappe.equals("Toutes")){
            return statisticsRepository.findByType(type);
        }
        return statisticsRepository.findByNappeAndType(nappe, type);
    }
}