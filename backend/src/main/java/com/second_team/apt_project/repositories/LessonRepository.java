package com.second_team.apt_project.repositories;

import com.second_team.apt_project.domains.Lesson;
import com.second_team.apt_project.repositories.customs.LessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> , LessonRepositoryCustom {
}
