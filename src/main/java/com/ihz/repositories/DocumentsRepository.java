package com.ihz.repositories;

import com.ihz.models.Document;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DocumentsRepository extends JpaRepository<Document, Integer> {
}
