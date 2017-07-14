package com.ihz.repositories;

import com.ihz.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MessagesRepository extends JpaRepository<Message, Integer> {
}
