package com.ihz.services;

import com.ihz.forms.Register;
import com.ihz.models.Role;
import com.ihz.models.User;
import com.ihz.repositories.RoleRepository;
import com.ihz.repositories.UserRepository;
import com.ihz.validation.EmailExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService, IUserService {
    @Autowired
    private UserRepository userRepository;


    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        for (Role role : user.getRoles()) {
            grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword(), grantedAuthorities);
    }

    @Transactional
    @Override
    public User registerNewUserAccount(Register accountDto)
            throws EmailExistsException {

        if (emailExist(accountDto.getEmail())) {
            throw new EmailExistsException(
                    "There is an account with that email adress: "
                            + accountDto.getEmail());
        }
        User user = new User();
        user.setName(accountDto.getName());
        user.setPassword(accountDto.getPassword());
        user.setEmail(accountDto.getEmail());
        Set<Role> roles = new HashSet<Role>();
        roles.add(roleRepository.findOne((long) 2));
        user.setRoles(new HashSet<Role>(roles));
        return userRepository.save(user);
    }

    private boolean emailExist(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }
}
