package com.ihz.controllers;

import com.ihz.models.Layer;
import com.ihz.repositories.LayersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/layers")
public class LayersController {


    @Autowired
    private LayersRepository layersRepository;


    @RequestMapping(value = "/{layer}", method = RequestMethod.PATCH)
    @ResponseBody
    public void update(@RequestBody Layer layer) {
        layersRepository.save(layer);
    }

    @RequestMapping(value = "/{layer}", method = RequestMethod.DELETE)
    @ResponseBody
    public void update(@PathVariable Integer layer) {
        layersRepository.delete(layer);
    }
}
