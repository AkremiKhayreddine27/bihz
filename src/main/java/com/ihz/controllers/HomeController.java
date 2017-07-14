package com.ihz.controllers;

import com.google.common.collect.Lists;
import com.ihz.models.Message;
import com.ihz.repositories.MessagesRepository;
import it.ozimov.springboot.mail.model.Email;
import it.ozimov.springboot.mail.model.defaultimpl.DefaultEmail;
import it.ozimov.springboot.mail.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.mail.internet.InternetAddress;
import java.io.UnsupportedEncodingException;

@Controller
public class HomeController {

    @Autowired
    private MessagesRepository messagesRepository;

    @Autowired
    public EmailService emailService;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @RequestMapping("/")
    public String index() {
        return "index";
    }


    @RequestMapping(value = "/contact", method = RequestMethod.GET)
    public String contact() {
        return "contact";
    }

    @RequestMapping(value = "/contact", method = RequestMethod.POST)
    public void contact(@RequestBody Message message) throws UnsupportedEncodingException {
        final Email email = DefaultEmail.builder()
                .from(new InternetAddress("IHZ", "IHZ"))
                .to(Lists.newArrayList(new InternetAddress(adminEmail, "Pomponius Attĭcus")))
                .subject("Contact IHZ de " + message.getFrom_name())
                .body(message.getContent())
                .encoding("UTF-8").build();

        emailService.send(email);
        messagesRepository.save(message);
    }

    @RequestMapping(value = {"/404"}, method = RequestMethod.GET)
    public String NotFoudPage(ModelMap model) {
        model.addAttribute("loggedinuser", getPrincipal());
        return "error/pagenotfound";
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
