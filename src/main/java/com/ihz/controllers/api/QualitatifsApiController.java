package com.ihz.controllers.api;

import com.ihz.models.Qualitatif;
import com.ihz.models.Statistic;
import com.ihz.repositories.QualitatifsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qualitatifs")
public class QualitatifsApiController {

    @Autowired
    private QualitatifsRepository qualitatifsRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Qualitatif> index() {
        return qualitatifsRepository.findAll();
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public Qualitatif store(@RequestBody Qualitatif qualitatif) {
        return qualitatifsRepository.save(qualitatif);
    }

    @RequestMapping(value = "/getTypes", method = RequestMethod.POST)
    public List<Qualitatif> getTypes() {
        return qualitatifsRepository.findDistinctByType();
    }

    @RequestMapping(value = "/getDates", method = RequestMethod.GET)
    public List<Qualitatif> getDates(@RequestParam String type) {
        return qualitatifsRepository.findDistinctByDate(type);
    }

    @RequestMapping(value = "/getNappesWithType", method = RequestMethod.GET)
    public List<Qualitatif> getNappesWithType(@RequestParam String type) {
        return qualitatifsRepository.findDistinctNappeBytype(type);
    }

    @RequestMapping(value = "/getData", method = RequestMethod.GET)
    public List<Qualitatif> getData(@RequestParam String type, @RequestParam String nappe) {
        if (nappe.equals("Toutes")) {
            return qualitatifsRepository.findByTypeOrderByDateAsc(type);
        } else {
            return qualitatifsRepository.findByNappeAndType(nappe, type);
        }
    }
}
