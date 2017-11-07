package com.ihz.controllers.api;

import com.ihz.models.Role;
import com.ihz.models.User;
import com.ihz.repositories.RoleRepository;
import com.ihz.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UsersApiController {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<User> index() {
        return userRepository.findAll();
    }

    @RequestMapping(value = "/{user}", method = RequestMethod.GET)
    public User show(@PathVariable Integer user) {
        return userRepository.findOne(user);
    }


    @RequestMapping(value = "/{user}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Integer user) {
        userRepository.delete(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public void edit(@PathVariable Integer id, @RequestBody User user) {
        User user1 = userRepository.findOne(id);
        user.setPassword(user1.getPassword());
        user.setRoles(user1.getRoles());
        userRepository.save(user);
    }

    @RequestMapping(value = "/{user}/assignRole", method = RequestMethod.POST)
    public void assignRole(@PathVariable Integer user, @RequestBody Integer[] roles) {
        Set<Role> roles1 = new HashSet<Role>();
        for (Integer i : roles) {
            roles1.add(roleRepository.findOne((long) i));
        }
        User user1 = userRepository.findOne(user);
        user1.setRoles(roles1);
        userRepository.save(user1);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> store(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        } else {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            User u = userRepository.save(user);
            return ResponseEntity.ok(u);
        }
    }
}
