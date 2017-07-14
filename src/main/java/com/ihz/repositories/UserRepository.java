package com.ihz.repositories;

import com.ihz.models.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Integer> {
    User findByName(String name);
    User findByEmail(String email);
}
