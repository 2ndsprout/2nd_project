package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.LessonUser;
import com.second_team.apt_project.repositories.customs.LessonUserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonUserRepository extends JpaRepository<LessonUser, Long> , LessonUserRepositoryCustom {
}
