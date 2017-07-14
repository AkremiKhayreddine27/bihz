package com.ihz.controllers.api;

import com.ihz.models.Role;
import com.ihz.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolesApiController {
    @Autowired
    private RoleRepository roleRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Role> index() {
        return roleRepository.findAll();
    }
}
