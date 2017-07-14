package com.ihz.controllers;

import com.ihz.models.Geoserver;
import com.ihz.models.Layer;
import com.ihz.repositories.GeoserverRepository;
import com.ihz.repositories.LayersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@PreAuthorize("isAuthenticated()")
public class MapController {

    @Autowired
    private LayersRepository layersRepository;

    @Autowired
    private GeoserverRepository geoserverRepository;

    @RequestMapping("/map")
    public String index() {
        return "map";
    }

    @RequestMapping("/map/getAllCouches")
    @ResponseBody
    public List<Layer> getAllLayers() {
        return layersRepository.findAll();
    }

    @RequestMapping(value = "/admin/geoserver", method = RequestMethod.GET)
    @ResponseBody
    public Geoserver getConfig() {
        return geoserverRepository.findOne(1);
    }

    @RequestMapping(value = "/admin/geoserver", method = RequestMethod.POST)
    @ResponseBody
    public Geoserver configure(@RequestBody Geoserver geoserver) {
        return geoserverRepository.save(geoserver);
    }

}
