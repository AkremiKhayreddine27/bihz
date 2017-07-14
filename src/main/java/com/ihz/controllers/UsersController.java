package com.ihz.controllers;

import com.ihz.models.User;
import com.ihz.repositories.UserRepository;
import com.ihz.services.UserService;
import com.ihz.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletContext;


@Controller
public class UsersController {


    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;



    private final StorageService storageService;

    @Autowired
    public UsersController(StorageService storageService, ServletContext context) {
        this.storageService = storageService;
    }


    @RequestMapping("/auth")
    @ResponseBody
    public User auth() {
        String userName = getPrincipal();
        User user = userService.findByName(userName);
        return user;
    }


    public String getPrincipal() {
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }
}
