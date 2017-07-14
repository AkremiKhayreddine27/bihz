package com.ihz.services;

import com.ihz.models.User;
import com.ihz.repositories.RoleRepository;
import com.ihz.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@Transactional
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void save(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(new HashSet<>(roleRepository.findAll()));
        userRepository.save(user);
    }

    @Override
    public User findByName(String name) {
        return userRepository.findByName(name);
    }

    @Override
    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }

}
