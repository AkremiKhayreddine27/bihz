package com.ihz.services;

public interface SecurityService {
    public String findLoggedInUsername();
    public void autologin(String email, String password);
}
