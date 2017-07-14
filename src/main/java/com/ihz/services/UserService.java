package com.ihz.services;


import com.ihz.models.User;

public interface UserService {
    public void save(User user);
    public User findByName(String name);
    public User findByEmail(String email);

}
