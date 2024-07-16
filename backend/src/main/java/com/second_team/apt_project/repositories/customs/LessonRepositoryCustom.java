package com.second_team.apt_project.repositories.customs;

import com.second_team.apt_project.domains.Apt;
import com.second_team.apt_project.domains.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LessonRepositoryCustom {
    Page<Lesson> findByApt(Long aptId,  Pageable pageable);
}
