package com.ihz.controllers.api;

import com.ihz.models.Message;
import com.ihz.repositories.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageApiController {

    @Autowired
    private MessagesRepository messagesRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Message> index() {
        return messagesRepository.findAll();
    }
}
