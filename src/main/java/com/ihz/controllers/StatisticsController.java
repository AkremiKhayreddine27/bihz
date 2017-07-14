package com.ihz.controllers;

import com.ihz.models.Qualitatif;
import com.ihz.models.Statistic;
import com.ihz.repositories.QualitatifsRepository;
import com.ihz.repositories.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.xml.transform.Result;
import java.util.stream.Collectors;


@Controller
public class StatisticsController {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Autowired
    QualitatifsRepository qualitatifsRepository;

    @RequestMapping(value = "/statistics", method = RequestMethod.GET)
    public String index() {
        return "statistics/index";
    }

    @RequestMapping(value = "/qualitatifs", method = RequestMethod.GET)
    public String qualitatifIndex() {
        return "statistics/qualitatif";
    }

    @RequestMapping(value = "/statistics/create", method = RequestMethod.GET)
    public String create() {
        return "statistics/create";
    }

    @RequestMapping(value = "/statistics", method = RequestMethod.POST)
    public ResponseEntity<?> store(@Valid @RequestBody Statistic statistic, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            System.out.println(bindingResult.toString());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        } else {
            Statistic s = statisticsRepository.save(statistic);
            return ResponseEntity.ok(s);
        }

    }

    @RequestMapping(value = "/qualitatifs", method = RequestMethod.POST)
    public ResponseEntity<?> storeQualificatif(@Valid @RequestBody Qualitatif qualitatif, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            System.out.println(bindingResult.toString());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        } else {
            Qualitatif s = qualitatifsRepository.save(qualitatif);
            return ResponseEntity.ok(s);
        }

    }

    @RequestMapping(value = "/statistics/{statistic}", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer statistic) {
        statisticsRepository.delete(statistic);
    }

    @RequestMapping(value = "/qualitatifs/{qualitatif}", method = RequestMethod.DELETE)
    @ResponseBody
    public void deleteQualificatif(@PathVariable Integer qualitatif) {
        qualitatifsRepository.delete(qualitatif);
    }
}
