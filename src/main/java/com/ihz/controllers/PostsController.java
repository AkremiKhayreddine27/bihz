package com.ihz.controllers;

import com.ihz.models.Document;
import com.ihz.models.Post;
import com.ihz.models.PostSearch;
import com.ihz.models.User;
import com.ihz.repositories.DocumentsRepository;
import com.ihz.repositories.PostsRepository;
import com.ihz.services.UserService;
import com.ihz.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/posts")
public class PostsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private DocumentsRepository documentsRepository;

    private final StorageService storageService;

    @Autowired
    public PostsController(StorageService storageService) {
        this.storageService = storageService;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "posts/index";
    }

    @RequestMapping(value = "/create", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public String create() {
        return "posts/create";
    }


    @RequestMapping(value = "/{post}", method = RequestMethod.GET)
    public String show() {
        return "posts/show";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> store(@Valid @RequestBody Post post, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        } else {
            String userName = getPrincipal();
            User user = userService.findByName(userName);
            post.setUser(user);
            Post p = postsRepository.save(post);
            return ResponseEntity.ok(p);
        }
    }

    @RequestMapping(value = "/{post}/edit", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public String edit() {
        return "posts/edit";
    }

    @RequestMapping(value = "{post}", method = RequestMethod.PATCH)
    @ResponseBody
    public Post update(@RequestBody Post post) {
        return postsRepository.save(post);
    }

    @RequestMapping(value = "/{post}/upload", method = RequestMethod.POST)
    @ResponseBody
    public void upload(MultipartHttpServletRequest request, @PathVariable Integer post) throws IOException {
        Map<String, MultipartFile> fileMap = request.getFileMap();
        for (MultipartFile multipartFile : fileMap.values()) {
            storageService.store(multipartFile);
            Document document = new Document();
            document.setName(multipartFile.getOriginalFilename());
            document.setPath("/upload/" + multipartFile.getOriginalFilename());
            document.setExtension("pdf");
            document.setLink("/upload/" + multipartFile.getOriginalFilename());
            document.setPost(postsRepository.findOne(post));
            documentsRepository.save(document);
        }
    }

    @RequestMapping(value = "/search", method = RequestMethod.POST)
    @ResponseBody
    public List<Post> search(@RequestBody PostSearch post) {
        return postsRepository.findAllLikeTile(post.getTitle());
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
