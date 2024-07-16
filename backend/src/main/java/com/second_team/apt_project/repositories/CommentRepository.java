package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Comment;
import com.second_team.apt_project.repositories.customs.CommentRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryCustom {
}
