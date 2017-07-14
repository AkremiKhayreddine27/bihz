package com.ihz.repositories;

import com.ihz.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PostsRepository extends JpaRepository<Post, Integer> {

    public List<Post> findAllByOrderByCreatedAtDesc();

    public List<Post> findFirst5ByOrderByCreatedAtDesc();

    @Query("Select p from Post p where p.title like %:title% or p.description like %:title%")
    public List<Post> findAllLikeTile(@Param("title") String title);
}
